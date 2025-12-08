/* Gavin Stankovsky
*  December 2025
*  Bookings API Route
*/

//import { getBookedAppts } from "@/app/lib/services/appointmentServices";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { getBookings } from "@/app/lib/services/BookingService";

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
    //const result = await getBookedAppts(id); // TODO: give data from whenever, data currently is today onward
    const result = await getBookings({ serviceProviderId: id }, session.user.id); //added by Jackie, works with current routes
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("Error inside of api/bookings/[id]: ", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
