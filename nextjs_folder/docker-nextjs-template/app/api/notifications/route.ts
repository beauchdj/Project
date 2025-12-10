/* Gavin Stankovsky
 *  November 2025
 *  Gavin's notification database API (*Obselete (Not used))
 */

"use server";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Notification } from "@/app/lib/types/Notification";

/**
 * Endpoint for notification bell
 * @returns row of appointments that are 2 days out along with canceled appointments
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL(req.url);
    const uid = url.searchParams.get("uid");
    // Select all appointments that are booked two days out from today
    const dbResp = await pool.query(
      `SELECT appt_bookings.id AS noteid, apptid, userid, spid, bookstatus,starttime,endtime,service,providername,fullname FROM appt_bookings 
    JOIN appts_avail ON appts_avail.id = appt_bookings.apptid 
    JOIN users on users.id = spid WHERE userid = $1
    AND starttime::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '2 days';`,
      [uid]
    );
    const items: Notification[] = dbResp.rows;
    items.map((itm) => (itm.status = "Upcoming"));

    // select all notifications for the current user from their session
    const notifications = await pool.query(
      `SELECT notifications.id AS noteid, status, userid, spid, providername, starttime, endtime, service, servicecategory, appts_avail.id AS availid, users.id AS usersid FROM notifications JOIN appts_avail ON apptid = appts_avail.id JOIN users ON appts_avail.spid = users.id WHERE notifications.userid = $1;`,
      [session.user.id]
    );
    const ret = [...notifications.rows, ...dbResp.rows];
    return NextResponse.json(ret, { status: 200 });
  } catch (error) {
    console.log("Error in GET api/notifications/route.ts ", error);
    return NextResponse.json({ error: "Error with Database" }, { status: 500 });
  }
}
/**
 *
 * @param req incomding http request
 * @returns
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { noteid } = await req.json();

    await pool.query("DELETE FROM notifications WHERE id = $1 RETURNING id", [
      noteid,
    ]);
    // console.log("Delete from /api/notifications query ", query);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.log("Error in DELETE api/notifications/route.ts ", error);
    return NextResponse.json({ error: "Error with Database" }, { status: 500 });
  }
}

/**
 * Inserts a notification with a userid that points to the receiver of the notification
 * @param req: body:
 * {who: "sp"|"cust" (who has cancelled the appt the cust or sp),
 *  apptid: string (appointment associated with the notificaion),
 *  status: 'Booked'|"Cancelled"|"Upcoming"}
 * @returns 201 response no-content
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // who=who to send notification to, apptid=appointment assocaited with notification, status="Booked"|"Upcoming"|"Cancelled"
    const { who, apptid, status } = await req.json();

    type NotificationData = {
      starttime: string;
      endtime: string;
      service: string;
      spid: string;
      avail_id: string;
      userid: string;
    };

    const curUserId = session.user.id;
    // Selects data from appts_avail and joins appt_booking for spid and userid coorelated to notificaion/appointment
    const notifData = await pool.query(
      "SELECT starttime,endtime, appts_avail.id AS avail_id, spid, userid, service FROM appts_avail JOIN appt_bookings ON appt_bookings.apptid = appts_avail.id WHERE userid = $1 OR spid = $1;",
      [curUserId]
    );
    const notifs: NotificationData = notifData.rows[0];
    // based on who parameter
    switch (who) {
      case "sp": // return customer id of appointment
        await pool.query(
          "INSERT INTO notifications (userid, apptid, status) VALUES ($1,$2,$3) RETURNING id",
          [notifs.userid, apptid, status]
        );

        break;
      case "cust": // return sp id of appointment
        await pool.query(
          "INSERT INTO notifications (userid, apptid, status) VALUES ($1,$2,$3) RETURNING id",
          [notifs.spid, apptid, status]
        );
        break;
      default:
        return NextResponse.json(
          { error: "Bad Request:\nReason: who!='cust'|'sp'  " },
          { status: 400 }
        );
    }
    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.log("Error in GET api/notifications/route.ts ", error);
    return NextResponse.json({ error: "Error with Database" }, { status: 500 });
  }
}
