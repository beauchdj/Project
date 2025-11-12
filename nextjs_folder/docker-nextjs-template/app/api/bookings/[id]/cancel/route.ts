import { NextResponse } from "next/server";
import { auth } from "@/auth";
// import { cancelBookedAppt } from "@/app/lib/services/appointmentServices";
import { pool } from "@/lib/db";
import { Booking } from "@/app/lib/types/Booking";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
  }

  try {
    // const result = await cancelBookedAppt(id, session.user.id);
    await pool.query("DELETE FROM appt_bookings WHERE id = $1", [id]);

    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.log("Error in api/bookings/[id]/cancel ", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
