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
 * Clients cannot bypass role-based restrictions using query parameters.
 * Bookings are never deleted from the database. Cancelling a booking preserves history.
*************************************************************************************************************************/
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { BookingFilters } from "../../lib/types/BookingFilters";
import { getBookings, createBooking} from "../../lib/services/BookingService";

/*************************GET /api/bookings***************************************************************
* Returns a list of bookings visible to the authenticated user.
    - Admins can see all bookings.
    - Service providers can see bookings for appointment slots they own.
    - Customers can see bookings they have made.

 * Supported query parameters (all optional):
    - viewAs: "Admin", "Provider", or "Customer" to specify the perspective for filtering
    - customerId: filter by customer id
    - serviceProviderId: filter by service provider id
    - status: "Booked" or "Cancelled"
    - startAfter: ISO datetime string; include bookings starting at or after this time
    - startBefore: ISO datetime string; include bookings starting at or before this time
    - serviceId: filter by service
    - serviceCategory: "Beauty", "Medical", or "Fitness"
    - customerName: filter by customer name (partial match)
    - providerName: filter by service provider name (partial match)
 * Example:
    - GET /api/bookings?status=Booked&serviceCategory=Medical
 * Successful response (200): The response body contains an object with a bookings array. Each booking has the shape of the BookingView
**********************************************************************************************************************/

export async function GET(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const paramsViewAs = searchParams.get("viewAs");
    let viewAs: BookingFilters["viewAs"];
    if (paramsViewAs === "Admin" || paramsViewAs === "Provider" || paramsViewAs === "Customer") {
        viewAs = paramsViewAs;
    }
    const filters: BookingFilters = {
        customerId: searchParams.get("customerId") ?? undefined,
        serviceProviderId: searchParams.get("serviceProviderId") ?? undefined,
        status: searchParams.get("status") as BookingFilters["status"] | undefined,
        startAfter: searchParams.get("startAfter") ?? undefined,
        startBefore: searchParams.get("startBefore") ?? undefined,
        serviceId: searchParams.get("serviceId") ?? undefined,
        serviceCategory: searchParams.get("serviceCategory") as
            | BookingFilters["serviceCategory"]
            | undefined,
        customerName: searchParams.get("customerName") ?? undefined,
        providerName: searchParams.get("providerName") ?? undefined,
        viewAs,
    };

    try {
        const bookings = await getBookings(filters, session.user.id);
        return NextResponse.json(
            { bookings },
            {status: 200 }
        );
    } catch (error: any) {
        console.error("Get bookings error:", error);
        return NextResponse.json(
            { message: "Server Error" },
            {status: 500}
        );
    }
}
/*************************POST /api/bookings***************************************************************
* Creates a new booking for an appointment slot.
* Only authenticated users may call this endpoint. 
* The backend will reject the request if the appointment does not exist, is already booked, or conflicts with another booking by the same customer.

* Request body:
    apptId: appointment slot id (required)

* Example:
    POST /api/bookings
    Content-Type: application/json
    {"apptId": "uuid"}

 * Successful response (201): {"bookingId": "new-booking-id"}

 * Errors:
    400 Missing apptId
    401 Unauthorized
    404 Appointment does not exist
    409 Appointment already booked
    409 Booking conflicts with an existing booking
    500 Server error
***********************************************************************************************************************/
export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, {status: 401 });
    }

    const { apptId } = await request.json();

    if(!apptId) {
        return NextResponse.json( 
            { error: "Missing appointmentSlotId" },
            { status: 400 }
        );
    }

    try {
        const booking = await createBooking(apptId,session.user.id);

        return NextResponse.json(
            { bookkingId: booking.id },
            {status: 201 }
        );
    } catch (error: any) {
        console.error("Create booking error:", error);

            switch (error.message) {
      case "APPT_NOT_FOUND":
        return NextResponse.json(
          { error: "Appointment does not exist" },
          { status: 404 }
        );

      case "SLOT_ALREADY_BOOKED":
        return NextResponse.json(
          { error: "Appointment is already booked" },
          { status: 409 }
        );

      case "BOOKING_CONFLICT":
        return NextResponse.json(
          { error: "Appointment conflicts with an existing booking" },
          { status: 409 }
        );

      default:
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        );
    }
  }
}



