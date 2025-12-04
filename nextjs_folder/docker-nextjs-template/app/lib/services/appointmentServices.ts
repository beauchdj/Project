import { pool } from "@/lib/db";
import { AppointmentFilters } from "../types/AppointmentFilters";
import {Appointment} from "../types/Appointment";


export async function getAppointments(filters: AppointmentFilters, userId: string) : Promise<Appointment[]> {
  /* get user to determine access */
  const { rows: userRows } = await pool.query(
    `SELECT id, isadmin, issp
    FROM users
    WHERE id = $1`,
    [userId]
  );

  const user = userRows[0];
  if(!user) {
    throw new Error("USER_NOT_FOUND");
  }

  const params: any[] = [];
  const where: string[] = [];

  /* Role-based permissions:
   * Admins can view all appointments
   * Service providers can view their appointments
   * Customers can view only active and available appointments
   */

  if (!user.isadmin) {
    if (user.issp && filters.status !== "Available") {
      // default provider view to view their own slots
      params.push(user.id)
      where.push(`a.spid = $${params.length}`);
    } else {
      // customer view OR a provider browsing available appointments
      where.push(`a.isactive = true`);
      where.push(
        `NOT EXISTS (
          SELECT 1
          FROM appt_bookings as b
          WHERE b.apptid = a.id
          AND b.bookstatus = 'Booked')`
        );
    }
  }

   if (filters.serviceProviderId) {
    params.push(filters.serviceProviderId);
    where.push(`a.spid = $${params.length}`);
  }

  if (filters.startAfter) {
    params.push(filters.startAfter);
    where.push(`a.starttime >= $${params.length}`);
  }

  if (filters.startBefore) {
    params.push(filters.startBefore);
    where.push(`a.starttime <= $${params.length}`);
  }

  if (filters.service) {
    params.push(filters.service);
    where.push(`a.service = $${params.length}`);
  }

  if (filters.serviceCategory) {
    params.push(filters.serviceCategory);
    where.push(`sp.servicecategory = $${params.length}`);
  }

   if (filters.status === "Available") {
    where.push(`a.isactive = true`);
    where.push(`
      NOT EXISTS (
        SELECT 1
        FROM appt_bookings b
        WHERE b.apptid = a.id
        AND b.bookstatus = 'Booked'
      )`);
  }

  if (filters.status === "Booked") {
    where.push(`
      EXISTS (
        SELECT 1
        FROM appt_bookings b
        WHERE b.apptid = a.id
        AND b.bookstatus = 'Booked'
      )`);
  }

  if (filters.status === "Inactive") {
    where.push(`a.isactive = false`);
  }

  const whereStmt = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const query = 
      `SELECT
        a.id AS id,
        a.starttime AS starttime,
        a.endtime AS endtime,
        a.service AS service,
        sp.servicecategory AS sp_servicecat,
        sp.providername AS sp_providername,
        sp.fullname AS sp_fullname,
        c.fullname AS cust_fullname,
        b.id AS bookingid
    FROM appts_avail a
    JOIN users sp ON sp.id = a.spid
    LEFT JOIN appt_bookings b
      ON b.apptid = a.id
      AND b.bookstatus = 'Booked'
    LEFT JOIN users c ON c.id = b.userid
    ${whereStmt}
    ORDER BY a.starttime ASC`;
    console.log("Checking query for GET appts...");
    console.log(query);
    const { rows } = await pool.query(query,params);
    return rows;
}

export async function createAppointmentSlot(spId: string, service: string, date: string, starttime: string, endtime: string) {
  const start = new Date(`${date}T${starttime}`);
  const end = new Date(`${date}T${endtime}`);

  const conflict = await pool.query(
    `SELECT 1
    FROM appts_avail
    WHERE spid = $1
    AND tsrange(starttime, endtime, '[)')
      && tsrange($2, $3, '[)')
      Limit 1`,
      [spId,start,end]
  );
  if (conflict.rowCount) {
    throw new Error("APPOINTMENT_CONFLICT");
  }

  try {
    const result = await pool.query(
       `INSERT INTO appts_avail (spid, starttime, endtime, service, isactive)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id`,
      [spId, start, end, service]
    );

    return { apptId: result.rows[0].id };
  } catch (error: any) {
    console.error("Create appointment error:", error);

    if (error.code === "23P01") {
      throw new Error("APPOINTMENT_CONFLICT");
    }

    throw new Error("CREATE_APPOINTMENT_FAILED");
  }
}

export async function deleteAppointmentSlot(
  apptId: string,
  userId: string
) {
  // check for existing bookings
  const bookings = await pool.query(
    `SELECT 1
     FROM appt_bookings
     WHERE apptid = $1
     LIMIT 1`,
    [apptId]
  );

  // never booked,  hard delete
  if (bookings.rowCount === 0) {
    const result = await pool.query(
      `DELETE FROM appts_avail
       WHERE id = $1
       AND spid = $2
       RETURNING id`,
      [apptId, userId]
    );

    if (!result.rowCount) {
      throw new Error("FORBIDDEN");
    }

    return { deleted: true, hardDelete: true };
  }

  // previously booked, soft delete
  const result = await pool.query(
    `UPDATE appts_avail
     SET isactive = false
     WHERE id = $1
     AND spid = $2
     RETURNING id`,
    [apptId, userId]
  );

  if (!result.rowCount) {
    throw new Error("FORBIDDEN");
  }

  return { deleted: true, hardDelete: false };
}

export async function updateAppointmentSlot(
  apptId: string,
  isActive: boolean,
  userId: string
) {
  const result = await pool.query(
    `UPDATE appts_avail
     SET isactive = $1
     WHERE id = $2
     AND spid = $3
     RETURNING id`,
    [isActive, apptId, userId]
  );

  if (!result.rowCount) {
    throw new Error("FORBIDDEN");
  }

  return { success: true };
}

/*
// for service provider to create a new appointment slot
//   checks that they do not have other appointment slots that conflict
export async function createAvailabilitySlot(
  spId: string,
  service: string,
  date: string,
  starttime: string,
  endtime: string
) {
  const apptConflict = await pool.query(
    `SELECT id FROM appts_avail
    WHERE spid = $1
    AND tsrange(starttime, endtime, '[)') && tsrange($2, $3, '[)')
    LIMIT 1`,
    [`${spId}`, `${date}T${starttime}`, `${date}T${endtime}`]
  );

  if (apptConflict.rowCount) {
    console.log("Appointment Conflict Detected");
    throw new Error("Appointment Conflict");
  }
  // dateTime format YYYY-MM-DDTHH:MM:SS
  const realStartTime = new Date(`${date}T${starttime}`);
  const realEndTime = new Date(`${date}T${endtime}`);

  try {
    const result = await pool.query(
      `INSERT INTO appts_avail (spid, starttime,endtime,service)
             VALUES($1,$2,$3,$4)
             RETURNING id`,
      [spId, realStartTime, realEndTime, service]
    );
    return { apptId: result.rows[0].id };
  } catch (error: any) {
    // catch DB constraint violation
    if (
      error?.code === "23P01" ||
      error?.constraint === "appts_avail_no_overlap"
    ) {
      console.log("DB Constraint Violation - Appointment Overlap");
      throw new Error("CONFLICT: Appointment Overlap");
    }
    console.log("Appointment Creation Error: ", error);
    throw new Error("Appointment Creation Error");
  }
}

// get service provider appointments (open and booked, not cancelled)
export async function getAllSpAppts(spId: string) {
  try {
    const { rows } = await pool.query(
      `SELECT a.starttime, a.endtime, a.service, c.fullname, b.bookstatus, b.id as bookingid, a.id
       FROM appts_avail AS a
       LEFT JOIN appt_bookings as b ON b.apptid = a.id AND b.bookstatus = 'Booked'
       Left JOIN users as c ON c.id = b.userid
       WHERE spID = $1
       AND a.starttime > NOW()
       ORDER BY a.starttime asc`,
      [spId]
    );
    return rows;
  } catch (error) {
    throw new Error("Get Sp Appointments Error");
  }
}

// returns all available appointments (cancelled or never booked) for a customer
export async function getAllOpenAppts(serviceCategory: string | null) {
  try {
    const { rows } = await pool.query(
      `SELECT a.starttime,a.endtime,a.service,sp.providername,a.id
       FROM appts_avail as a
       JOIN users as sp ON sp.id = a.spid
       WHERE NOT EXISTS (
          SELECT 1
          FROM appt_bookings as b
          WHERE b.apptid = a.id
          AND b.bookstatus = 'Booked'
        )
        AND a.starttime > NOW()
        AND sp.servicecategory = $1;
        `,
      [serviceCategory]
    );
    return rows;
  } catch (error) {
    console.log("appointment services error: ", error);
    throw new Error("Get All Available Appointments Error");
  }
}


export async function deleteAvailAppt(apptId: string, userId: string) {
  try {
    const result = await pool.query(
      `DELETE FROM appts_avail
      WHERE
        id = $1
        AND
        spid = $2
      RETURNING id;`,
      [apptId, userId]
    );

    if (result.rowCount === 0) {
      return { deleted: false };
    }

    return {
      deleted: true,
      bookingId: result.rows[0].id,
    };
  } catch (error) {
    console.error("Delete Appointment Error: ", error);
    throw new Error("Delete Appointment Error");
  }
}

*/

/* MOVED TO BOOKING SERVICE (With modifications) */
/*
export async function bookAppointment(userId: string, apptId: string) {
  // get the appointment to be booked
  const { rows } = await pool.query(
    `SELECT * 
    FROM appts_avail
    WHERE id = $1
    `,
    [apptId]
  );
  const appt = rows[0];

  if (!appt) {
    throw new Error("Appt does not exist");
  }

  // Check if appointment has already been booked by another customer
  const alreadyBooked = await pool.query(
    `SELECT id 
     FROM appt_bookings 
     WHERE apptid = $1
     AND bookstatus = 'Booked'
    LIMIT 1`,
    [apptId]
  );

  if (alreadyBooked.rowCount) {
    console.log("Already Booked");
    throw new Error("Appointment is already Booked");
  }

  console.log(
    "Check if appt conflicts with another appt that this customer has already booked..."
  );

  // Check if appointment conflicts with another appointment that this customer has already booked

  const bookingConflict = await pool.query(
    `SELECT b.id FROM appt_bookings as b
    JOIN appts_avail as a ON a.id = b.apptId
    WHERE b.userid = $1
    AND b.bookstatus = 'Booked'
    AND tsrange(a.starttime, a.endtime, '[)') && tsrange($2, $3, '[)')
    LIMIT 1`,
    [userId, appt.starttime, appt.endtime]
  );

  if (bookingConflict.rowCount) {
    console.log("Booking Conflict Detected");
    throw new Error(
      "Booking Conflict: Appointment conflicts with an existing booked appointment"
    );
  }
  // if no conflicts, create new booking
  try {
    const result = await pool.query(
      `INSERT INTO appt_bookings (apptid, userid, bookstatus,booked_at)
         VALUES ($1, $2, 'Booked', NOW())
         Returning id`,
      [apptId, userId]
    );

    //return result.rows[0].id as string;
    return { ok: true, booking: result.rows[0] };
  } catch (err: any) {
    if (
      err.code === "23505" ||
      err.constraint === "appt_bookings_one_booked_per_id"
    ) {
      return {
        ok: false,
        error: "Appointment already booked by another customer.",
      };
    } else {
      throw new Error("Error creating booking");
    }
  }
}
*/
/*
export async function getBookedAppts(userId: string) {
  try {
    const { rows } = await pool.query(
      `SELECT appts.starttime, appts.endtime, appts.service, sp.providername, bookings.id, bookings.bookstatus, apptid
             FROM appts_avail as appts
             LEFT JOIN appt_bookings as bookings ON appts.id = bookings.apptid
             LEFT JOIN users as cust ON bookings.userid = cust.id
             LEFT JOIN users as sp ON appts.spid = sp.id
             WHERE bookings.userid = $1
             AND appts.starttime > NOW()
             ORDER BY appts.starttime ASC`,
      [userId]
    );
    return rows;
  } catch (error) {
    throw new Error("Get Bookings Error");
  }
}
  */
/*
export async function cancelBookedAppt(bookingId: string, userId: string) {
  // check that the user who is trying to cancel has permission to do so
  // (is the customer, the service provider, or is an admin)
  // actually want to get rid of this booking and insert into notification table
  // booking should just hold the appointments that are booked, canceled appts will become available again
  // so: behavior should be: delete canceled booked appt on cancel, insert appointment into notifications
  const query = `WITH canceller AS (
      SELECT u.id, u.isadmin
      FROM users as u
      WHERE u.id = $2
    )
    UPDATE appt_bookings as b
    SET bookstatus = 'Cancelled',
        cancelled_at = NOW(),
        cancelled_by = $2
    FROM appts_avail as a, canceller
    WHERE b.id = $1
    AND a.id = b.apptId
    AND (
      b.userId = $2
      OR canceller.isadmin
      OR a.spId = $2
    )
    AND b.bookstatus = 'Booked'
    RETURNING b.id,b.apptid,b.userid;`;

  try {
    const result = await pool.query(query, [bookingId, userId]);

    if (result.rowCount === 0) {
      return { ok: false };
    }

    const row = result.rows[0];
    return {
      ok: true,
      bookingId: row.id,
      apptId: row.apptid,
      userId: row.userid,
    };
  } catch (error) {
    console.error("Delete Booked Appointment Error: ", error);
    throw new Error("Delete Booked Appointment Error");
  }
}
*/
