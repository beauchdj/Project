import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { BookingFilters } from "../../lib/types/BookingFilters";
import { getBookings, createBooking} from "../../lib/services/BookingService";

//import { getBookedAppts, bookAppointment } from "@/app/lib/services/appointmentServices";

/* Supported Filters
  customerId?: string;
  serviceProviderId?: string;
  status?: "Booked" | "Cancelled";
  startAfter?: string;
  startBefore?: string;
  serviceCategory?: string;
*/

export async function GET(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

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


/*
export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });   
    }

    const { apptId } = (await request.json());

    if (!apptId) {
        return NextResponse.json({ error: "Missing apptId" }, { status: 400 });
    }

    try {
        const result = await bookAppointment(session.user.id, apptId);
        if (result.ok) {
            return NextResponse.json({ result }, { status: 201 } );
        } else {
            return NextResponse.json({ error: result.error },{ status: 409 } )
        }
    } catch (error: any) {
        console.error("Booking error:", error);
        const message = error?.message || "Server Error";
        return NextResponse.json({ error: message }, { status: 400 });  
    }
}

export async function GET(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await getBookedAppts(session.user.id); 
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}


export async function DELETE(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = (await request.json()) as { bookingId: string };

    if (!bookingId) {
        return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    try {
        const result = await deleteBookedAppt(bookingId, session.user.id);
        return NextResponse.json(result, {status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
    */