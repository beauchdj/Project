import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {cancelBooking} from "../../../../lib/services/BookingService";

type Params = {
  params: { id: string };
};

export async function PATCH (request: Request, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status } = await request.json();

  if (status !== "Cancelled") {
    return NextResponse.json(
      { error: "Invalid booking status" },
      {status: 400 }
    );
  }

  try {
   const booking = cancelBooking(params.id,session.user.id);

  return NextResponse.json(
    {bookingId: params.id, status },
    {status:200 }
  );
  } catch (error: any) {
    console.error("Update booking error:", error);

    if (error.code === "FORBIDDEN") {
      return NextResponse.json({ error: error.message }, {status: 403 });
    }

    return NextResponse.json(
      {message: "Server error" },
      { status: 500 }
    )
  }
}



// import { cancelBookedAppt } from "@/app/lib/services/appointmentServices";
//import { pool } from "@/lib/db";
//import { BookingView } from "@/app/lib/types/BookingView";



/*
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
  */
