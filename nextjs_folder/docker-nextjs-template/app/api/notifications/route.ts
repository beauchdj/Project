"use server";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint for notification bell
 * @returns row of appointments that are 2 days out.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");
  const dbResp = await pool.query(
    `SELECT * FROM appt_bookings 
    JOIN appts_avail ON appts_avail.id = appt_bookings.apptid 
    JOIN users on users.id = spid WHERE userid = $1 
    AND starttime::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '2 days';`,
    [uid]
  );
  // const canceledAppts = `
  // SELECT * FROM appts_avail JOIN users ON spid = users.id JOIN appt_bookings ON appts_avail.id = appt_bookings.apptid WHERE appts_avail.id = $1', [];
  // `
  // console.log("NOTIFICATION ENDPOINT: ", dbResp.rows);
  return NextResponse.json(dbResp.rows, { status: 200 });
}
