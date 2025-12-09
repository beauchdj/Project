/*******************************************************************************************************
 * Jaclyn Brekke
 * December 2025
 * 
 * Notification Database Service
 *
 *  Database service responsible for managing user notifications.
 *  Currently supports notifications generated for appointment booking
 *  cancellations and provides basic read/update functionality.
 *
 * Responsibilities:
 *  - Retrieve active notifications for a user
 *  - Create cancellation notifications when bookings are cancelled
 *  - Update notification status (active/new)
 *
 * Basic Idea:
 *  - Notifications are stored in the `notifs` table
 *  - Each notification has:
 *      * sender (sent_by)
 *      * recipient (send_to)
 *      * message content (msg)
 *      * activity flags (isactive, isnew)
 *
 **************************************************************************************************/

import { pool } from "@/lib/db";

/************** getNotificationsForUser ************************************************************
 *
 * Returns all active notifications for a given user.
 *
 * Visibility rules:
 *  - Notifications are returned only for the specified user
 *  - Only notifications marked as active are returned
 *
 * Inputs:
 *  - userId: ID of the user receiving notifications
 *
 * Successful response:
 *  - Returns an array of notification objects:
 *      * id
 *      * message
 *      * isactive
 *      * isnew - (not really used or needed)
 *
 * Errors:
 *  - Database query errors
 *
 **************************************************************************************************/

export async function getNotificationsForUser(userId: string) {
    const { rows } = await pool.query(
        `SELECT id, msg as message, isactive, isnew
        FROM notifs
        WHERE send_to = $1
        AND isactive = true`,
        [userId]);
    return rows;
}

/************** createCancelNotification ***********************************************************
 *
 * Creates notification records when an appointment booking is cancelled.
 *
 * Behavior:
 *  - Gathers booking details, appointment details, and who the canceller is
 *  - Determines notification recipients based on the role of the canceller
 *  - Inserts one or more notifications into the database
 *
 * Recipient determination rules:
 *  - If cancelled by an admin:
 *      * Notify both the customer and service provider
 *  - If cancelled by a service provider:
 *      * Notify the customer only
 *  - If cancelled by a customer:
 *      * Notify the service provider only
 *
 * Inputs:
 *  - sentBy: ID of the user cancelling the booking
 *  - bookingId: ID of the cancelled booking
 *
 * Message content:
 *  - Includes:
 *      * service name
 *      * appointment date
 *      * start and end time
 *      * name of the cancelling user
 *
 * Post-conditions:
 *  - One notification row is created for each intended recipient
 *
 * Errors:
 *  - Booking not found
 *  - Database query errors
 *
 **************************************************************************************************/

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

/************** updateNotificationStatus ***********************************************************
 *
 * Updates the active and new-status flags for a notification.
 *
 * Behavior:
 *  - Allows notifications to be deleted (soft delete)
 *  - Allows notifications to be marked as read/unread
 *
 * Inputs:
 *  - notifId: notification ID
 *  - isActive: whether the notification remains active
 *  - isNew: whether the notification is considered new - unsued
 *
 * Successful response:
 *  - Returns the updated notification row
 *
 * Notes:
 *  - Typically used to mark notifications as read or dismissed
 *
 * Errors:
 *  - Database update errors
 *
 **************************************************************************************************/

export async function updateNotificationStatus(notifId: string, isActive: boolean, isNew: boolean) {
    const result = await pool.query(
            `UPDATE notifs
            SET isactive = $2, isnew = $3
            WHERE id = $1`,
            [notifId, isActive, isNew]
    );

    return result.rows[0];
}