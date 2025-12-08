/**************************************************************************************************************
 *
 * Jaclyn Brekke
 * December 2025
 *
 *  Booking Database Service
 * 
 *  Database service responsible for querying and managing appointment bookings.
 *  Handles role-based booking visibility, booking creation, conflict detection, and cancellation.
 *
 * Responsibilities:
 *  - Retrieve bookings visible to the authenticated user
 *  - Create bookings with conflict checks
 *  - Cancel individual and bulk bookings
 *  - Generate cancellation notifications where applicable
 *
 * Role Definitions:
 *  - Admin:
 *      * Full visibility and control over all bookings
 *  - Service Provider (SP):
 *      * Can view and manage bookings for their own appointment slots
 *  - Customer:
 *      * Can view and manage their own bookings
 *
 *************************************************************************************************************/
import { pool } from "@/lib/db";
import { BookingFilters } from "../types/BookingFilters";
import { Booking } from "../types/Booking";
import { createCancelNotification } from "./notificationService";

/************** getBookings *************************************************************************
 *
 * Returns bookings visible to the authenticated user, based on role and optional filter criteria.
 *
 * View modes:
 *  - Admin:
 *      * Requires authenticated admin user
 *      * Can view all bookings in the system
 *  - Provider:
 *      * Requires authenticated service provider or admin
 *      * Defaults to bookings for the provider’s own appointment slots
 *  - Customer:
 *      * Default for non-admin / non-provider users
 *      * Shows bookings belonging to the requesting customer
 *
 * If viewAs is not supplied as a query param, it is taken from the requesting user’s role.
 *
 * Authorization rules are applied before any filters.
 * Filters are evaluated only against records the user has access to based on auth rules.
 *
 * Query filters (all optional):
 *  - viewAs: Admin | Provider | Customer
 *  - customerId: filter by customer user ID
 *  - serviceProviderId: filter by provider user ID
 *  - status: booking status (e.g. Booked, Cancelled)
 *  - startAfter: return bookings for appointments starting at or after this time
 *  - startBefore: return bookings for appointments starting at or before this time
 *  - serviceCategory: filter by provider service category
 *  - customerName: partial match on customer full name (case-insensitive)
 *  - providerName: partial match on provider name (case-insensitive)
 *
 * Successful response: Returns an array of Booking objects
 *
 * Errors:
 *  - User does not exist
 *  - NOT_AUTHORIZED_ADMIN_VIEW
 *  - NOT_AUTHORIZED_PROVIDER_VIEW
 *
 **************************************************************************************************/
    export async function getBookings(filters: BookingFilters, userId: string)  : Promise<Booking[]> {
        
         /* get the user */
        const { rows: userRows } = await pool.query(
            `SELECT * 
            FROM users
            WHERE id = $1
            `,
            [userId]
        );
        const user = userRows[0];

        if (!user) {
            throw new Error("User does not exist");
        }
        
        const params: any[] = [];
        const where: string[] = [];

        //default to user roles if viewas not provided
        if (!filters.viewAs) {
            filters.viewAs = user.isadmin ? "Admin" : user.issp ? "Provider" : "Customer";
        }

        switch (filters.viewAs) {
            case "Admin":
                if (!user.isadmin) {
                    throw new Error("NOT_AUTHORIZED_ADMIN_VIEW");
                }
                break;
            case "Provider":
                if (!user.isadmin && !user.issp) {
                throw new Error("NOT_AUTHORIZED_PROVIDER_VIEW");
            }
            if (!filters.serviceProviderId) {
                params.push(user.id);
                where.push(`a.spid = $${params.length}`);
            }
            break;

            case "Customer":
                if (!filters.customerId) {
                    params.push(user.id);
                    where.push(`b.userid = $${params.length}`);
                }
                break;
            }

        /* add filters from query params */
        if (filters.customerId) {
            params.push(filters.customerId);
            where.push(`b.userid = $${params.length}`);
        }
        if (filters.serviceProviderId) {
            params.push(filters.serviceProviderId);
            where.push(`a.spid = $${params.length}`);
        }

        if (filters.status) {
            params.push(filters.status);
            where.push(`b.bookstatus = $${params.length}`);
        }

        if (filters.startAfter) {
            params.push(filters.startAfter);
            where.push(`a.starttime >= $${params.length}`);
        }

        if (filters.startBefore) {
            params.push(filters.startBefore);
            where.push(`a.starttime <= $${params.length}`);
        }

        if (filters.serviceCategory) {
            params.push(filters.serviceCategory);
            where.push(`sp.servicecategory = $${params.length}`);
        }

        if (filters.customerName) {
            params.push(`%${filters.customerName}%`);
             where.push(`c.fullname ILIKE $${params.length}`);
        }

        if (filters.providerName) {
            params.push(`%${filters.providerName}%`);
            where.push(`sp.providername ILIKE $${params.length}`);
        }
        const whereStmt = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

        const query = 
            ` SELECT
                a.starttime,
                a.endtime,
                a.service,
                sp.providername,
                sp.servicecategory,
                c.fullname,
                b.id AS id,
                b.bookstatus,
                a.id AS apptid,
                b.userid,
                a.isactive
              FROM appts_avail as a
              JOIN users sp ON sp.id = a.spid
              LEFT JOIN appt_bookings b ON b.apptid = a.id
              LEFT JOIN users c ON c.id = b.userid
              ${whereStmt}
              ORDER BY a.starttime ASC `;

              const { rows } = await pool.query(query,params);
              return rows;
    }
/************** createBooking ***********************************************************************
 *
 * Creates a new booking for a specific appointment slot.
 *
 * Preconditions:
 *  - Appointment slot must exist
 *  - Appointment slot must not already be booked
 *  - Customer must not have an overlapping booked appointment
 *
 * Conflict detection:
 *  - Prevents double-booking of appointment slots
 *  - Prevents a customer from holding overlapping bookings
 *  - Uses PostgreSQL tsrange overlap detection
 *
 * Inputs:
 *  - appointmentSlotId: apptId for the appt slot to be booked
 *  - customerId: userid of the customer creating the booking
 *
 * Behavior:
 *  - Validates that the appt slot exists
 *  - Checks for existing booked booking on the slot
 *  - Checks for time overlap with customer’s existing bookings
 *  - Inserts booking with status 'Booked' on success
 * TODO: add check for apptId isactive status
 *
 * Successful response:
 *  - Returns newly created Booking record
 *
 * Errors:
 *  - APPT_NOT_FOUND
 *  - SLOT_ALREADY_BOOKED
 *  - BOOKING_CONFLICT (overlapping customer booking)
 *
 **************************************************************************************************/
    export async function createBooking( appointmentSlotId: string, customerId: string) : Promise<Booking> {
        /* get the appointment to be booked */
        const { rows } = await pool.query(
            `SELECT * 
            FROM appts_avail
            WHERE id = $1
            `,
            [appointmentSlotId]
        );
        const appt = rows[0];

        if (!appt) {
            throw new Error("APPT_NOT_FOUND");
        }
       
        /* check if appointment is already booked */
        const alreadyBooked = await pool.query(
            `SELECT 1
            FROM appt_bookings
            WHERE apptid = $1
            AND bookstatus = 'Booked'
            LIMIT 1`,
            [appointmentSlotId]
        );

        if (alreadyBooked.rowCount) {
            throw new Error("SLOT_ALREADY_BOOKED");
        }
        
        /* Check if appointment conflicts with another appointment that this customer has already booked */
        const bookingConflict = await pool.query(
            `SELECT b.id FROM appt_bookings as b
            JOIN appts_avail as a ON a.id = b.apptId
            WHERE b.userid = $1
            AND b.bookstatus = 'Booked'
            AND tsrange(a.starttime, a.endtime, '[)') && tsrange($2, $3, '[)')
            LIMIT 1`,
            [customerId, appt.starttime, appt.endtime]
        );

        if (bookingConflict.rowCount) {
            console.log("Booking Conflict Detected");
            throw new Error("BOOKING_CONFLICT");
        }
  
        /* if no conflicts, create new booking */
            const result = await pool.query(
                `INSERT INTO appt_bookings (apptid, userid, bookstatus,booked_at)
                VALUES ($1, $2, 'Booked', NOW())
                Returning id`,
                [appointmentSlotId, customerId]
            );

            return result.rows[0];
        }

 /************** cancelBooking ************************************************************************
 *
 * Cancels a single booking.
 *
 * Access rules:
 *  - Booking customer may cancel their own booking
 *  - Service provider may cancel bookings for their own appointment slots
 *  - Admin may cancel any booking
 *
 * Cancellation behavior:
 *  - Updates booking status to 'Cancelled'
 *  - Stores cancellation timestamp and cancelling user
 *
 * Post-actions:
 *  - Attempts to create a cancellation notification (inserts into notif table)
 *
 * Inputs:
 *  - bookingId: id of booking to cancel
 *  - userid: userId of the actor performing the cancellation
 *
 * Successful response:
 *  - ok: true
 *  - bookingId, apptId, userId
 *
 * Failure response:
 *  - ok: false (booking not found or not cancellable)
 *
 * Errors:
 *  - Database errors
 *
 **************************************************************************************************/
    export async function cancelBooking(bookingId: string, userid:string) {
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
            const result = await pool.query(query, [bookingId, userid]);

            if (result.rowCount === 0) {
            return { ok: false };
            }

            const row = result.rows[0];

            try{
                await createCancelNotification(userid,bookingId);
            } catch (err) {
                //error silently so the cancel still goes through...
                console.error("Cancel notification creation failed:", err);
            }

            return {
            ok: true,
            bookingId: row.id,
            apptId: row.apptid,
            userId: row.userid,
            };
        } catch (error) {
            console.error("Cancel Booked Appointment Error: ", error);
            throw new Error("Cancel Booked Appointment Error");
        }
    }

    /************** cancelAllBookingsforSP **************************************************************
 *
 * Cancels all future booked appointments for a specific service provider.
 *
 * Access rules:
 *  - Admin may cancel bookings for any service provider
 *  - Service provider may cancel only their own bookings
 *
 * Behavior:
 *  - Only cancels bookings with status 'Booked'
 *  - Only affects future appointments
 *
 * Post-actions:
 *  - Attempts to create cancellation notifications for each booking
 *
 * Inputs:
 *  - spId: service provider userId whose bookings are being cancelled
 *  - userid: userId of actor performing the cancellation (the admin or the sp)
 *
 * Successful response:
 *  - cancelledCount: number of bookings cancelled
 *  - bookings: list of affected bookings
 *
 * Errors:
 *  - Authorization failure
 *  - Database errors
 *
 **************************************************************************************************/
    export async function cancelAllBookingsforSP(spId: string, userid:string) {
    // check that the user who is trying to cancel has permission to do so
    // (is the service provider, or is an admin)
        const query = 
            `UPDATE appt_bookings as b
            SET bookstatus = 'Cancelled',
                cancelled_at = NOW(),
                cancelled_by = $2
            FROM appts_avail as a
            JOIN users as u ON u.id = $2
            WHERE 
                a.spId = $1
                AND a.id = b.apptId
                AND b.bookstatus = 'Booked'
                AND a.starttime > NOW()
                AND (
                    u.isadmin
                    OR a.spid = $2
                )
            RETURNING b.id,b.apptid,b.userid;`;

        try {
            const result = await pool.query(query, [spId, userid]);

            for (const row of result.rows) {
                try {
                    await createCancelNotification(userid,row.id);
                } catch (err) {
                    console.error(`Notification failed for booking ${row.id}:`,err);
                }
            }

            return { ok: false,
                     cancelledCount: result.rowCount,
                     bookings: result.rows
             };

        } catch (error) {
            console.error("Cancel Booked Appointment Error: ", error);
            throw new Error("Cancel Booked Appointment Error");
        }
    }
/************** cancelAllBookingsforCust ************************************************************
 *
 * Cancels all future bookings for a specific customer.
 *
 * Access rules:
 *  - Admin may cancel bookings for any customer
 *  - Customer may cancel their own bookings
 *  - Service provider may cancel bookings on their own appointment slots
 *
 * Behavior:
 *  - Only cancels bookings with status 'Booked'
 *  - Only affects future appointments
 *
 * Post-actions:
 *  - Attempts to create cancellation notifications for each booking
 *
 * Inputs:
 *  - custId: customerId whose bookings are being cancelled
 *  - userid: userid of the actor performing the cancellation
 *
 * Successful response:
 *  - cancelledCount: number of bookings cancelled
 *  - bookings: list of affected bookings
 *
 * Errors:
 *  - Authorization failure
 *  - Database errors
 *
 **************************************************************************************************/
    export async function cancelAllBookingsforCust(custId: string, userid:string) {
    // check that the user who is trying to cancel has permission to do so
    // (is the customer, the service provider, or is an admin)
        const query = 
            `UPDATE appt_bookings as b
            SET bookstatus = 'Cancelled',
                cancelled_at = NOW(),
                cancelled_by = $2
            FROM appts_avail as a
            JOIN users as u ON u.id = $2
            WHERE 
                b.userid = $1
                AND a.id = b.apptId
                AND b.bookstatus = 'Booked'
                AND a.starttime > NOW()
                AND (
                    u.isadmin
                    OR b.userid = $2
                    OR a.spid = $2
                )
            RETURNING b.id,b.apptid,b.userid;`;

        try {
            const result = await pool.query(query, [custId, userid]);

            for (const row of result.rows) {
                try {
                    await createCancelNotification(userid,row.id);
                } catch (err) {
                    console.error(`Notification failed for booking ${row.id}:`,err);
                }
            }
            
            return { ok: false,
                     cancelledCount: result.rowCount,
                     bookings: result.rows
             };

        } catch (error) {
            console.error("Cancel Booked Appointment Error: ", error);
            throw new Error("Cancel Booked Appointment Error");
        }
    }
