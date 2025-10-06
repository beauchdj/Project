// This is your **service layer** - it contains all business logic.
// It doesn't know about HTTP or Next.js. It just validates data,
// checks for conflicts, parses time, and interacts with the database.
// Keeping this outside of the route makes it easy to unit test and reuse.

import { pool } from "@/lib/db"; // Reuse your existing PostgreSQL pool

// Input payload shape expected from the client/API
type CreateSlotInput = {
    service?: string;
    date?: string;
    start?: string;
    end?: string;
};

// Returned shape for success (id of the newly created slot)
type CreateSlotResult = {id: number };

// Convert a local date ("YYYY-MM-DD") + local time ("HH:mm") to a UTC Date.
// Why this way?
// - Constructing a Date(y, m-1, d, hh, mm) creates a local timestamp respecting
//   the server's system timezone (or Node's TZ setting).
// - Calling .toISOString() converts that instant to UTC and stringifies it.
// - Constructing a new Date from that ISO gives a UTC-based Date object.
function toUtc(date: string, time: string): Date {
    const [y,m,d] = date.split("-").map(Number);
    const [hh,mm] = time.split(":").map(Number);
    const local = new Date(y, m-1, d, hh, mm, 0,0);
    return new Date(local.toISOString());
}

// Normalize service name and ensure non-empty
function normalizeService(s: string): string {
    const trimeed = s.trim();
    if (!trimeed) throw new Error("VALIDATION: Service is required.");
    return trimeed;
}

// Validate and convert the incoming payload into domain values
function validateAndBuild(input: CreateSlotInput) {
  const service = normalizeService(String(input.service ?? ""));
  const date = String(input.date ?? "");
  const start = String(input.start ?? "");
  const end = String(input.end ?? "");

  if (!date || !start || !end) {
    throw new Error("VALIDATION:All fields are required.");
  }

  const startAt = toUtc(date, start);
  const endAt = toUtc(date, end);

  // Ensure valid Date objects
  if (isNaN(+startAt) || isNaN(+endAt)) {
    throw new Error("VALIDATION:Invalid start/end times.");
  }

  // Use half-open interval [start, end) so back-to-back slots are allowed
  if (endAt <= startAt) {
    throw new Error("VALIDATION:End time must be after start time.");
  }

  return { service, startAt, endAt };
}

// ------ DB Helpers ----------
// Check if a provider already has a conflicting availability slot.
async function hasConflict(spId: string, startAt: Date, endAt: Date): Promise<boolean> {
  // Use parameterized query ($1, $2, ...) to prevent SQL injection.
  // We pass timestamps as ISO strings

  const { rowCount } = await pool.query(
        `SELECT 1
        FROM appts_avail
        WHERE spid = $1
        AND NOT ($3 <= starttime OR $2 >= endtime)
        LIMIT 1`, 
        [spId, startAt.toISOString(),endAt.toISOString(),]
    );

    // If any row is returned, there is a conflict
    return (rowCount ?? 0) > 0;
}

// Insert the new availability slot and return its new id
async function insertSlot(spId: string, service: string, startAt: Date, endAt: Date): Promise<number> { 
    try {
      const q = `
        INSERT INTO appts_avail (spid, service, starttime, endtime)
        VALUES ($1,$2,$3,$4)
        RETURNING id
        `;
      const { rows } = await pool.query (q, [spId, service,startAt.toISOString(),endAt.toISOString(),]);
      return rows[0].id;
    } catch (err: any) {
      // Postgres error object from 'pg' library
      if (err.constraint === "appts_avail_no_overlap" || err.code === "23P01") {
        throw new Error("CONFLICT: Appointments overlap.");
      }
      throw new Error(`Server:${err.message}`);
      }
    }

//---------Public Service for API ----------------
// Create a new availability slot for a provider.
// Validate input
// Check for overlap
// Insert into DB
// Return new id

export async function createAvailabilitySlot(spId: string, rawInput: unknown): Promise<CreateSlotResult> {
    try {
        const input = (rawInput ?? {}) as CreateSlotInput;
        const { service, startAt, endAt } = validateAndBuild(input);
        if (await hasConflict(spId, startAt, endAt)) {
            throw new Error("CONFLICT: Appointments overlap.");
        }

        const id = await insertSlot(spId, service, startAt, endAt);
        return { id };
    } catch (err: unknown) {
        // Re-throw with known prefixes the route understands (VALIDATION/CONFLICT/SERVER)
        const msg = String(err);
        if (msg.startsWith("VALIDATION:") || msg.startsWith("CONFLICT:") || msg.startsWith("SERVER:")) {
            throw err; // already well-formed
        }
        // Unknown error → treat as server error
            throw new Error(`SERVER:${msg}`);
    }
}

// ========== Types for availability search -- move to type folder ==========
export type AvailabilitySearchCriteria = {
  category?: string;
  provider?: string; 
  service?: string;
  date?: string; 
  start?: string;
  end?: string; 
  duration?: string;
};

export type AvailabilitySearchDto = {
  id: string;
  date: string; 
  starttime: string;
  endtime: string; 
  service: string;
  providerId: string;
  providerName: string;
  providerCategory: string;
};

// ========== Helper: build optional time filters ==========
function isoFromLocal(date: string, time: string) {
  // Local date + time → ISO (UTC)
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const local = new Date(y, (m - 1), d, hh || 0, mm || 0, 0, 0);
  return local.toISOString();
}

// ========== GET availability for searching ==========
export async function listAvailableAppointmentsForSearch(criteria: AvailabilitySearchCriteria): Promise<AvailabilitySearchDto[]> {
  // Build dynamic WHERE with parameter binding—safe and flexible
  const where: string[] = [];
  const params: any[] = [];
  let p = 1;

  // Search by provider category
  if (criteria.category?.trim()) {
    where.push(`LOWER(u.servicecategory) LIKE LOWER($${p++})`);
    params.push(`%${criteria.category.trim()}%`);
  }

  // Search by provider *name*
  if (criteria.provider?.trim()) {
    where.push(`LOWER(u.providername) LIKE LOWER($${p++})`);
    params.push(`%${criteria.provider.trim()}%`);
  }

  // Search by service (free text)
  if (criteria.service?.trim()) {
    where.push(`LOWER(a.service) LIKE LOWER($${p++})`);
    params.push(`%${criteria.service.trim()}%`);
  }

  // Date-only filter: match starttime’s date to YYYY-MM-DD
  if (criteria.date?.trim()) {
    where.push(`(a.starttime::date = $${p++}::date)`);
    params.push(criteria.date.trim());
  }

  // Start time lower bound (same-day-aware if date given, otherwise general time)
  if (criteria.date?.trim() && criteria.start?.trim()) {
    where.push(`a.starttime >= $${p++}::timestamp`); //update to timestamptz
    params.push(isoFromLocal(criteria.date.trim(), criteria.start.trim()));
  }

  if (criteria.date?.trim() && criteria.end?.trim()) {
    where.push(`a.endtime <= $${p++}::timestamp`); //update to timestamptz
    params.push(isoFromLocal(criteria.date.trim(), criteria.end.trim()));
  }

  // Minimum duration (minutes); computed as end - start
  if (criteria.duration?.trim()) {
    const mins = parseInt(criteria.duration.trim(), 10);
    if (!Number.isNaN(mins) && mins > 0) {
      // interval 'X minutes'
      where.push(`(EXTRACT(EPOCH FROM (a.endtime - a.starttime)) / 60) >= $${p++}`);
      params.push(mins);
    }
  }

  // Core query:
 
  const q = `
    SELECT
      a.id,
      a.service,
      a.spid               AS provider_id,
      u.providername       AS provider_name,
      u.servicecategory    AS provider_category,
      a.starttime,
      a.endtime
    FROM appts_avail a
    JOIN users u
      ON u.id = a.spid
    LEFT JOIN appt_bookings b
      ON b.apptid = a.id
     AND b.bookstatus = 'Booked'      -- exclude already booked
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    AND b.id IS NULL                  -- only those with no "Booked" row
    ORDER BY a.starttime ASC
    LIMIT 200
  `;
  try {
    const { rows } = await pool.query(q, params);

    return rows.map((r) => {
      const startISO = new Date(r.starttime).toISOString();
      const endISO = new Date(r.endtime).toISOString();
      return {
        id: String(r.id),
        date: startISO.slice(0, 10), 
        starttime: startISO,
        endtime: endISO,
        service: String(r.service),
        providerId: String(r.provider_id),
        providerName: String(r.provider_name),
        providerCategory: String(r.provider_category || ""),
      };
    });
  } catch (err: any) {
    console.error("SEARCH SQL ERROR:", {
      code: err?.code,
      message: err?.message,
      detail: err?.detail,
      where: err?.where,
      query: q,
      params,
    });
    throw new Error(`Server:${err?.message || "Unknown DB error"}`);  
  }
}


// ========== POST booking ==========
type BookAppointmentInput = {
  apptId: string;     
  customerId: string;
};

export async function bookAppointment(input: BookAppointmentInput): Promise<string> {
  const { apptId, customerId } = input;

  if (!apptId) throw new Error("VALIDATION:Appointment id is required.");
  if (!customerId) throw new Error("VALIDATION:Customer id is required.");

  // 1) Read the appointment window
  const apptQ = `
    SELECT id, spid, service, starttime, endtime
    FROM appts_avail
    WHERE id = $1
    LIMIT 1
  `;
  const apptRes = await pool.query(apptQ, [apptId]);
  const appt = apptRes.rows[0];
  if (!appt) throw new Error("VALIDATION:Appointment not found.");

  const startISO = new Date(appt.starttime).toISOString();
  const endISO = new Date(appt.endtime).toISOString();

  // 2) Ensure the appointment is still unbooked
  const alreadyBookedQ = `
    SELECT 1
    FROM appt_bookings
    WHERE apptid = $1
      AND bookstatus = 'Booked'
    LIMIT 1
  `;
  const alreadyBooked = await pool.query(alreadyBookedQ, [apptId]);
  if (alreadyBooked.rowCount && alreadyBooked.rowCount > 0) {
    throw new Error("CONFLICT:This appointment was just booked by someone else.");
  }

  // 3) Customer conflict check: does customer already have a Booked slot that overlaps?
  const custConflictQ = `
    SELECT 1
    FROM appt_bookings b
    JOIN appts_avail a ON a.id = b.apptid
    WHERE b.userid = $1
      AND b.bookstatus = 'Booked'
      AND NOT ($3 <= a.starttime OR $2 >= a.endtime)
    LIMIT 1
  `;
  const custConflict = await pool.query(custConflictQ, [customerId, startISO, endISO]);
  if (custConflict.rowCount && custConflict.rowCount > 0) {
    throw new Error("CONFLICT:You already have an appointment overlapping this time.");
  }

  // 4) Insert booking as "Booked"
  try {
    const insertQ = `
      INSERT INTO appt_bookings (apptid, userid, bookstatus)
      VALUES ($1, $2, 'Booked')
      RETURNING id
    `;
    const ins = await pool.query(insertQ, [apptId, customerId]);
    const id = ins.rows?.[0]?.id;
    if (!id) throw new Error("SERVER:Booking created but no id returned.");
    return String(id);
  } catch (err: any) {

    throw new Error(`SERVER:${String(err?.message || err)}`);
  }
}