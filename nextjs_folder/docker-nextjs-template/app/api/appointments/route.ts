/************************************************************************************************************
 *  Jaclyn Brekke
 *  December 2025
 *
 * Appointments API
 * 
 * General Notes:
 * Appointment slots and bookings are separate resources.
 * All appointment endpoints require authentication. Unauthenticated requests return HTTP 401 Unauthorized.
 * Authorization and visibility rules are enforced by the backend. Query parameters do not allow a client to access records they are not permitted to see.
 * Appointments are not cancelled; bookings are cancelled. If a booking is cancelled, the appointment slot may become available again.
 * Soft-deleted appointment slots remain in the database and may appear in admin views.
 * Appointment data returned by GET /api/appointments matches the Appointment view type.
 
**************************************************************************************************************************************************************/

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAppointments, createAppointmentSlot,deleteAppointmentSlot } from "@/app/lib/services/appointmentServices";
import {AppointmentFilters} from "../../lib/types/AppointmentFilters";

/************** GET /api/appointments *****************************************************************
 * 
 * Returns appointment slots visible to the authenticated user.
 * Admins:
        - can see all appointment slots
        - includes past and future
        - includes booked, available, and inactive slots
 * Service providers:
        - by default, see their own appointment slots
        - may browse available appointments from other providers by requesting status=Available
 * Customers:
        -see only available appointment slots (slots are active, are not booked, and are in the future)
 * Query parameters (all optional):
        - serviceProviderId: filter by service provider id.
        - status: 
            - Available (active slot with no current booked booking)
            - Booked (active slot with a current booked booking)
            - Inactive (soft-deleted or unavailable slot)
        - startAfter: return appointments starting at or after this time.
        - startBefore: return appointments starting at or before this time.
        - service: filter by service name.
        - serviceCategory: Beauty, Medical, Fitness.
 * Authorization rules are applied first. Filters are applied only to records already visible to the user.

 * Examples:
 * 
 *  Get all available appointments (customer or service provider browsing):
 *  GET /api/appointments?status=Available
 * 
 *  Service provider views their own upcoming appointments:
 *  GET /api/appointments?startAfter=2025-01-01T00:00:00Z
 * 
 *  Admin views all inactive appointments:
 *  GET /api/appointments?status=Inactive
 * 
 * Successful response (200): Response body is an object with an appointments array. Each item matches the Appointment type.
 * 
 * Errors:
 *      - 401 Unauthorized
 *      - 500 Server error
 *************************************************************************************************************/
export async function GET(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const filters: AppointmentFilters = {
        serviceProviderId: searchParams.get("serviceProviderId") ?? undefined,
        status: searchParams.get("status") as | AppointmentFilters["status"] | undefined,
        startAfter: searchParams.get("startAfter") ?? undefined,
        startBefore: searchParams.get("startBefore") ?? undefined,
        serviceCategory: searchParams.get("serviceCategory") as
                    | AppointmentFilters["serviceCategory"]
                    | undefined,
    };

    try {
        const appointments = await getAppointments(filters,session.user.id);

        return NextResponse.json( { appointments }, { status: 200 });
    } catch (error) {
        console.error("Get appointments error:", error);
        return NextResponse.json(
            { error: "server error" },
            { status: 500 }
        );
    }
}

/************** POST /api/appointments *****************************************************************
 * Creates a new appointment slot.
 * Intended for service providers 
 * Prevents overlapping appointments
 * 
 * Request body: all fiels are required
    - date: date string in YYYY-MM-DD format.
    - starttime: time string (HH:MM).
    - endtime: time string (HH:MM).
    - service: service name.
 * Successful response (201): Returns the newly created appointment slot id.
 * 
 * Errors:
    - 400 Missing required fields
    - 401 Unauthorized
    - 409 Appointment conflict (overlapping appointment)
    - 500 Server error
**************************************************************************************************************/
export async function POST(request: Request) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });   
    }

    const { date, starttime, endtime, service } = await request.json();

    if (!service || !date || !starttime || !endtime) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const slot = await createAppointmentSlot(session.user.id, service, date, starttime, endtime);
        return NextResponse.json({ apptId: slot.apptId }, { status: 201 } );
    } catch (error: any) {
        console.error("Create appointment error:", error);

        if (error.message.includes("Conflict")) {
            return NextResponse.json(
                {error: error.message },
                {status: 409 }
            );
        }
        return NextResponse.json({ error: "Server Error" }, { status: 500 });  
    }
}

/***************DELETE /api/appointments/:id************************************************************
  * Deletes or deactivates an appointment slot.
  * Rules:
        - If the appointment slot has never been booked, it is permanently deleted.
        - If the appointment slot has been previously booked, it is soft-deleted (marked inactive).
        - Only the owning service provider or an admin may delete an appointment slot.
  * 
  * Successful response (200): Indicates whether the delete was hard or soft.
  * 
  * Errors:
        - 401 Unauthorized
        - 403 User not allowed to delete this appointment
        - 500 Server error
**********************************************************************************************************************/
type Params = { params: { id: string } };

export async function DELETE(
  request: Request,
  { params }: Params
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await deleteAppointmentSlot(
      params.id,
      session.user.id
    );

    return NextResponse.json(
      result,
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete appointment error:", error);

    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Not allowed to delete this appointment" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}









