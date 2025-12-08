/* Jaclyn Brekke
*  December 2025
*  Database Service
*/

import { pool } from "@/lib/db";
import { AppointmentFilters } from "../types/AppointmentFilters";
import {Appointment} from "../types/Appointment";
import { createCancelNotification } from "./notificationService";

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
      // default provider view to view their own slots (Booked and unbooked)
      params.push(user.id)
      where.push(`a.spid = $${params.length}`);
    } else {
      // customer view OR a provider browsing available appointments (as a customer)
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
      //where.push(`a.starttime > now()`);
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

export async function deleteAllSpApptSlots(spId: string, userId:string) {
        const query = 
            `UPDATE appts_avail as a
            SET isactive = false
            FROM users u
            WHERE 
                a.spId = $1
                AND a.starttime > NOW()
                AND (
                    u.isadmin
                    OR a.spid = $2
                )
            RETURNING a.spId;`;

        try {
            const result = await pool.query(query, [spId, userId]);

            return { ok: false,
                     cancelledCount: result.rowCount,
                     appointments: result.rows
             };

        } catch (error) {
            console.error("Cancel Appointment Error: ", error);
            throw new Error("Cancel Appointment Error");
        }
    }


export async function updateAppointmentSlot(
  apptId: string,
  isactive: boolean,
  userId: string
) {
  const conflict = await pool.query(
    `SELECT 1
    FROM appt_bookings b
    WHERE b.apptid = $1
      AND b.bookstatus = 'Booked'
    LIMIT 1`,
    [apptId]
  );
  if (conflict.rowCount) {
    throw new Error("APPOINTMENT_CONFLICT");
  }
  
  const result = await pool.query(
    `UPDATE appts_avail a
     SET isactive = $1
     FROM users u
     WHERE a.id = $2
     AND u.id = $3
     AND
      (spid = $3
      OR u.isadmin) 
     RETURNING a.id`,
    [isactive, apptId, userId]
  );

  if (!result.rowCount) {
    throw new Error("FORBIDDEN");
  }

  return { success: true };
}

