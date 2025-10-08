import { pool } from "@/lib/db";

export async function createAvailabilitySlot(
  spId: string,
  service: string,
  date: string,
  starttime: string,
  endtime: string
) {
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
  } catch (error) {
    console.log("Appointment Creation Error: ", error);
    throw new Error("Appointment Creation Error");
  }
}

export async function getAllSpAppts(spId: string) {
  try {
    const { rows } = await pool.query(
      `SELECT appts.starttime, appts.endtime, appts.service, clients.fullname
             FROM appts_avail as appts
             LEFT JOIN appt_bookings as bookings ON appts.id = bookings.apptid
             LEFT JOIN users as clients ON bookings.userid = clients.id
             WHERE appts.spid = $1
             ORDER BY appts.starttime ASC`,
      [spId]
    );
    return rows;
  } catch (error) {
    throw new Error("Get Sp Appointments Error");
  }
}

export async function getAllAvailAppts(serviceCategory: string | null) {
  console.log("Where does this search? ", serviceCategory);
  try {
    const { rows } = await pool.query(
      `SELECT appts.starttime, appts.endtime, appts.service, sps.providername, sps.servicecategory, clients.fullname, appts.id
             FROM appts_avail AS appts
             LEFT JOIN appt_bookings AS bookings ON bookings.apptid = appts.id
             JOIN users as sps ON appts.spid = sps.id
             LEFT JOIN users as clients ON bookings.userid = clients.id
             WHERE bookings.apptid IS NULL AND sps.servicecategory = $1
            `,
      [serviceCategory]
    );
    console.log("got back: ", rows);
    return rows;
  } catch (error) {
    console.log("appointment services error: ", error);
    throw new Error("Get All Available Appointments Error");
  }
}

export async function bookAppointment(apptId: string, userId: string) {
  const alreadyBooked = await pool.query(
    `SELECT id FROM appt_bookings WHERE apptid = $1 LIMIT 1`,
    [apptId]
  );

  if (alreadyBooked.rowCount) {
    throw new Error("Already Booked");
  }

  const { rows } = await pool.query(
    `INSERT INTO appt_bookings (apptid, userid, bookstatus)
         VALUES ($1, $2, 'Booked')
         Returning id`,
    [apptId, userId]
  );

  return rows[0].id as string;
}

export async function getBookedAppts(userId: string) {}
