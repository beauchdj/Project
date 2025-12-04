import { pool } from "@/lib/db";
import { BookingFilters } from "../types/BookingFilters";
import { Booking } from "../types/Booking";

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

        /* Filter records based on role type 
            -Admins can see any/all records
            -Service providers can see records where spId = user.id
            -Customers can see records where userId = user.id
        */
        if (!user.isadmin) { 
            if (user.issp) {
                params.push(user.id);
                where.push(`a.spid = $${params.length}`);
            } else {
                params.push(user.id);
                where.push(`b.userid = $${params.length}`);
            }
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
                b.userid
              FROM appts_avail as a
              JOIN users sp ON sp.id = a.spid
              LEFT JOIN appt_bookings b ON b.apptid = a.id
              LEFT JOIN users c ON c.id = b.userid
              ${whereStmt}
              ORDER BY a.starttime ASC `;

              const { rows } = await pool.query(query,params);
              return rows;
    }

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

    /* old version to cancel a single booking only */
    export async function cancelBooking(bookingId: string, userid:string) {
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
            const result = await pool.query(query, [bookingId, userid]);

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
            console.error("Cancel Booked Appointment Error: ", error);
            throw new Error("Cancel Booked Appointment Error");
        }
    }

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

            return { ok: false,
                     cancelledCount: result.rowCount,
                     bookings: result.rows
             };

        } catch (error) {
            console.error("Cancel Booked Appointment Error: ", error);
            throw new Error("Cancel Booked Appointment Error");
        }
    }

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

            return { ok: false,
                     cancelledCount: result.rowCount,
                     bookings: result.rows
             };

        } catch (error) {
            console.error("Cancel Booked Appointment Error: ", error);
            throw new Error("Cancel Booked Appointment Error");
        }
    }
