import { pool } from "@/lib/db";
import { start } from "repl";

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
  )

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
  } catch (error:any) {

    // catch DB constraint violation
    if (error?.code === "23P01" || error?.constraint === "appts_avail_no_overlap") {
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
/*
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
  */
  // Check if appointment conflicts with another appointment that this customer has already booked
  
  const bookingConflict = await pool.query(
    `SELECT b.id FROM appt_bookings as b
    JOIN appts_avail as a ON a.id = b.apptId
    WHERE b.userid = $1
    AND b.bookstatus = 'Booked'
    AND tsrange(a.starttime, a.endtime, '[)') && tsrange($2, $3, '[)')
    LIMIT 1`,
    [userId, appt.starttime, appt.endtime]
  )

  if (bookingConflict.rowCount) {
    console.log("Booking Conflict Detected");
    throw new Error("Booking Conflict: Appointment conflicts with an existing booked appointment");
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
    if (err.code === '23505' || err.constraint === 'appt_bookings_one_booked_per_id') {
        return {
          ok: false,
          error: 'Appointment already booked by another customer.',
        };
    } else {
      throw new Error('Error creating booking');
    }
  }
}

export async function getBookedAppts(userId: string) {
  try {
    const { rows } = await pool.query(
      `SELECT appts.starttime, appts.endtime, appts.service, sp.providername, bookings.id, bookings.bookstatus
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


export async function cancelBookedAppt(bookingId: string, userId: string) {

  // check that the user who is trying to cancel has permission to do so
      // (is the customer, the service provider, or is an admin)

  const query = 
  `WITH canceller AS (
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
    const result = await pool.query(
      query,
       [bookingId,userId]
    );

    if (result.rowCount === 0) {
      return { ok: false };
    }

   const row = result.rows[0]
  return { 
    ok: true ,
    bookingId: row.id,
    apptId: row.apptid,
    userId: row.userid
    };
  } catch (error) {
    console.error("Delete Booked Appointment Error: ", error);
    throw new Error("Delete Booked Appointment Error");
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
    deleted: true ,
    bookingId: result.rows[0].id,
    };
  } catch (error) {
    console.error("Delete Appointment Error: ", error);
    throw new Error("Delete Appointment Error");
  }
}