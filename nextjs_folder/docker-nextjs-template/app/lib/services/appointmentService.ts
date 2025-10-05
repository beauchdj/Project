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
