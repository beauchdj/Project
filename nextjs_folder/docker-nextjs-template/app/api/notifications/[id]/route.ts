"use server";
import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
/**
 * This needs to return all appointments that are associated with the current user
 * @param req
 * @param param1
 * @returns
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  // get bookings 2 days out from the bookings table... shouldnt be pulling from there tbh
  const dbResp = await pool.query(
    `SELECT * FROM appt_bookings 
    JOIN appts_avail on appts_avail.id = appt_bookings.apptid 
    JOIN users on users.id = spid
    WHERE userid = $1 OR spid = $1`,
    [id]
  );
  // console.log("GOT BACK ROWS: ", dbResp.rows);
  return NextResponse.json(dbResp.rows, { status: 200 });
}
