/* Jaclyn Brekke
*  December 2025
*  Database service 
*/

import { pool } from "@/lib/db";

export async function getNotificationsForUser(userId: string) {
    const { rows } = await pool.query(
        `SELECT id, msg as message, isactive, isnew
        FROM notifs
        WHERE send_to = $1
        AND isactive = true`,
        [userId]);
    return rows;
}

export async function createCancelNotification(
    sentBy: string,
    bookingId: string
) {

    //get all the needed info about the cancelled booking and who cancelled it
    const { rows, rowCount } = await pool.query(
        `SELECT
            canceller.id AS canceller_id,
            canceller.fullname AS canceller_name,
            canceller.isAdmin AS canceller_isAdmin,
            canceller.isSp AS canceller_isSp,
            cust.id AS customer_id,
            sp.id AS provider_id,
            a.service,
            a.starttime,
            a.endtime
        FROM appt_bookings b
        JOIN users cust ON cust.id = b.userid
        JOIN appts_avail a ON a.id = b.apptid
        JOIN users sp ON sp.id = a.spid
        JOIN users canceller ON canceller.id = $1
        WHERE b.id = $2`,
        [sentBy,bookingId]);

    if (rowCount === 0) {
        throw new Error("Booking not found");
    }

    const row = rows[0];

    //determine who needs to recieve the notification
    let recipients: string[] = [];
    
    if (row.canceller_isadmin) {
        recipients = [row.customer_id, row.provider_id];
    } else if (row.canceller_issp) {
        recipients = [row.customer_id];
    } else {
        recipients = [row.provider_id];
    }

    //build message
    const dateStr = new Date(row.starttime).toLocaleDateString("en-US",{weekday:"short",month:"long",day:"numeric",year:"numeric",});
    const startStr = new Date(row.starttime).toLocaleTimeString([],{hour:"numeric",minute:"2-digit",});
    const endStr = new Date(row.endtime).toLocaleTimeString([],{hour:"numeric",minute:"2-digit",});

    const msg = `Your ${row.service} appointment for ${dateStr} from ${startStr} to ${endStr} has been cancelled by ${row.canceller_name}.`;

    //insert notification(s) into table

    for (const sendTo of recipients) {
        await pool.query(
            `INSERT INTO notifs (sent_by, send_to, msg)
            VALUES ($1, $2, $3)`,
            [sentBy,sendTo,msg]
        );
    }
}

export async function updateNotificationStatus(notifId: string, isActive: boolean, isNew: boolean) {
    const result = await pool.query(
            `UPDATE notifs
            SET isactive = $2, isnew = $3
            WHERE id = $1`,
            [notifId, isActive, isNew]
    );

    return result.rows[0];
}