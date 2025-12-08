/*  Jaclyn Brekke
 *  December 2025
 *
 * Appointment Database Service
 *
 *  Database service responsible for querying and updating appointment slot data.
 *  Enforces role-based visibility, conflict detection, and authorization rules.
 *
 * Responsibilities:
 *  - Retrieve appointment slots visible to the authenticated user
 *  - Create new appointment slots with conflict detection
 *  - Soft-delete appointment slots (individually or in bulk)
 *  - Prevent slot deactivation when an active booking exists
 *
 * Role Definitions:
 *  - Admin:
 *      * Full visibility and control over all appointment slots
 *  - Service Provider (SP):
 *      * Can manage their own appointment slots
 *      * May browse available slots from other providers
 *  - Customer:
 *      * Can only see available, active, and unbooked slots
 *
 **************************************************************************************************/
import { pool } from "@/lib/db";
import { AppointmentFilters } from "../types/AppointmentFilters";
import {Appointment} from "../types/Appointment";

/************** getAppointments ********************************************************************
 *
 * Returns appointment slots visible to the authenticated user, filtered by the provided criteria.
 *
 * Authorization rules are applied first. Filters are evaluated only against records already
 * visible to the user based on role.
 *
 * Visibility rules:
 *  Admins:
 *      - Can see all appointment slots
 *      - Includes past and future
 *      - Includes booked, available, and inactive slots
 *
 *  Service Providers:
 *      - By default, see their own appointment slots (booked + unbooked)
 *
 *  Customers:
 *      - See only available appointment slots
 *      - Slots must be:
 *          * active
 *          * unbooked
 *          * visible according to applied filters
 *
 * Query filters (all optional):
 *  - serviceProviderId: filter by service provider ID
 *  - startAfter: return appointments starting at or after this timestamp
 *  - startBefore: return appointments starting at or before this timestamp
 *  - service: filter by service name
 *  - serviceCategory: Beauty | Medical | Fitness
 *  - status:
 *      * Available  – active slot with no booked booking
 *      * Booked     – active slot with a current booked booking
 *      * Inactive   – soft-deleted or unavailable slot
 *
 *
 * Successful response:
 *  - Returns an array of Appointment objects
 *
 * Errors:
 *  - USER_NOT_FOUND
 *  - Database query errors
 *
 **************************************************************************************************/

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
      //where.push(`a.starttime > now()`);  decided this should be a front end call
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

/************** createAppointmentSlot **************************************************************
 *
 * Creates a new appointment slot for a service provider.
 *
 * Conflict detection:
 *  - Prevents overlapping appointment slots for the same service provider
 *  - Uses PostgreSQL tsrange overlap detection
 *
 * Inputs:
 *  - spId: service provider ID
 *  - service: service name
 *  - date: ISO date string (YYYY-MM-DD)
 *  - starttime: HH:MM string
 *  - endtime: HH:MM string
 *
 * Behavior:
 *  - Converts date + times into timestamps
 *  - Checks for time overlap against existing slots
 *  - Inserts active appointment slot on success
 *
 * Successful response:
 *  - Returns object containing newly created appointment ID
 *
 * Errors:
 *  - APPOINTMENT_CONFLICT (overlapping slot)
 *  - CREATE_APPOINTMENT_FAILED
 *
 **************************************************************************************************/
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

/************** deleteAllSpApptSlots ***************************************************************
 *
 * Soft-deletes all future appointment slots for a service provider.
 *
 * Access rules:
 *  - Admins may delete slots for any provider
 *  - Service providers may delete only their own slots
 *
 * Behavior:
 *  - Sets isactive = false
 *  - Applies only to future appointments
 *  - Does not affect past appointments
 *
 * Inputs:
 *  - spId: service provider whose slots are being deleted
 *  - userId: authenticated actor performing the action
 *
 * Successful response:
 *  - Returns count of updated appointments and affected rows
 *
 * Errors:
 *  - Authorization failure
 *  - Database errors
 *
 **************************************************************************************************/
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

/************** updateAppointmentSlot **************************************************************
 *
 * Updates the active status of an appointment slot.
 *
 * Conflict detection:
 *  - Prevents deactivating a slot that currently has an active booked booking
 *
 * Access rules:
 *  - Admins may update any appointment slot
 *  - Service providers may update only their own slots
 *
 * Inputs:
 *  - apptId: appointment slot ID
 *  - isactive: boolean flag indicating active / inactive
 *  - userId: authenticated actor performing the update
 *
 * Behavior:
 *  - Fails with conflict if slot is currently booked
 *  - Applies authorization rules before update
 *
 * Successful response:
 *  - { success: true }
 *
 * Errors:
 *  - APPOINTMENT_CONFLICT (slot has a booked booking)
 *  - FORBIDDEN (not authorized)
 *
 **************************************************************************************************/
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

/* pretty sure i can delete but keeping around for a min
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
*/