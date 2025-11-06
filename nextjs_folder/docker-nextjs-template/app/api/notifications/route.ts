"use server";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint for notification bell
 * @returns row of appointments that are 2 days out.
 */
export async function GET(req: NextRequest) {
  console.log("Hit the endpoing!");
  const url = new URL(req.url);
  const uid = url.searchParams.get("uid");
  const dbResp = await pool.query(
    "SELECT * FROM appt_bookings JOIN appts_avail ON appts_avail.id = appt_bookings.apptid JOIN users on users.id = spid WHERE userid = $1 AND starttime::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '2 days';",
    [uid]
  );
  // console.log("NOTIFICATION ENDPOINT: ", dbResp.rows);
  return NextResponse.json(dbResp.rows, { status: 200 });
}
