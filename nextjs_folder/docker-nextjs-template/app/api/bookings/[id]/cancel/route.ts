/*****************************************************************************************************************
 * Jaclyn Brekke
 * December 2025
 * 
 * Bookings API
 * 
 * General Notes:
 * All bookings endpoints require authentication. 
 * If the user is not authenticated, the API will return HTTP 401 Unauthorized.
 * Authorization rules are enforced by the backend. 
 * Bookings are never deleted from the database. Cancelling a booking preserves history.
*******************************************************************************************************************/
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {cancelBooking} from "../../../../lib/services/BookingService";

/***********************PATCH /api/bookings/:id*******************************************************
 * Cancels an existing booking by updating its status to "Cancelled".
 * A booking can be cancelled by:
    - the customer who made the booking
    - the service provider who owns the appointment slot
    - an admin

 * Request body: {"status": "Cancelled"}
 * Only the value "Cancelled" is supported. Other values will result in an error.

 * Example: 
    PATCH /api/bookings/{bookingid}/cancel
    Content-Type: application/json
    {"status": "Cancelled"}

 * Successful response (200): {"success": true}

 * Errors:
    400 Invalid booking status
    401 Unauthorized
    403 User not allowed to cancel this booking
    500 Server error

*************************************************************************************************************/

type Params = {
  params: { id: string };
};

export async function PATCH (request: Request, { params }: {params: {id: string}}) {
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
