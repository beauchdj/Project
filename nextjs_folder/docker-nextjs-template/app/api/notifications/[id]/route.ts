"use server";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint for notification bell
 * @returns row of appointments that are 2 days out.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const dbResp = await pool.query(
    `SELECT * FROM appt_bookings 
    JOIN appts_avail on appts_avail.id = appt_bookings.apptid 
    JOIN users on users.id = spid
    WHERE userid = $1`,
    [id]
  );
  console.log(dbResp);
  // console.log("NOTIFICATION ENDPOINT: ", dbResp.rows);
  return NextResponse.json(dbResp.rows, { status: 200 });
}
