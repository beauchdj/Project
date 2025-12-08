/* Gavin Stankovsky
 *  December 2025
 *  Bookings API Route
 */

import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * This was gavin created, Used for the Admin View, a slight alteration from the regular route
 * which just uses the session's user id, this route takes a id from the path to use for
 * fetching the customers bookings
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !session.user.isSp) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    // Data shape should reflect the Booking.ts defined type
    const result = await getBookedApptsAllTime(id); // TODO: give data from whenever, data currently is today onward

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("Error inside of api/bookings/[id]: ", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function getBookedApptsAllTime(userId: string) {
  try {
    const { rows } = await pool.query(
      `SELECT appts.starttime, appts.endtime, appts.service, sp.providername, bookings.id, bookings.bookstatus, apptid
             FROM appts_avail as appts
             LEFT JOIN appt_bookings as bookings ON appts.id = bookings.apptid
             LEFT JOIN users as cust ON bookings.userid = cust.id
             LEFT JOIN users as sp ON appts.spid = sp.id
             WHERE bookings.userid = $1
             AND bookings.bookstatus != 'Cancelled'
             ORDER BY appts.starttime ASC`,
      [userId]
    );

    return rows;
  } catch (error) {
    throw new Error("Get Bookings Error");
  }
}
