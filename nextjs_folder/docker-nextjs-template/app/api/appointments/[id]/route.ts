/* Gavin Stankovsky, Jaclyn Brekke
*  December 2025 (Latest)
*  Appointment API route
*/
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { updateAppointmentSlot } from "@/app/lib/services/appointmentServices";

/************* PATCH /api/appointments/:id**********************************************************
* Jaclyn Brekke
* Updates an appointment slot.
* To be used only for soft deletes (marking an appointment inactive).
* 
* Request body: {"isActive": false} 
*
* Successful response (200):
* 
* Errors:
  - 400 Invalid request body
  - 401 Unauthorized
  - 403 User not allowed to update this appointment
  - 500 Server error
****************************************************************************************************************/

type Params = { params: { id: string } };

export async function PATCH(
  request: Request,
  { params }: Params
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { isActive } = await request.json();

  if (typeof isActive !== "boolean") {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    await updateAppointmentSlot(
      params.id,
      isActive,
      session.user.id
    );

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update appointment error:", error);

    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "Not allowed to update this appointment" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}



/**
 * This was gavin created, Used for the Admin View, a slight alteration from the regular route
 * which just uses the session's user id, this route takes a id from the path to use for
 * fetching the Sp appointments.
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
    // Data shape should reflect the Appointment.ts defined type
    //const result = await getAllSpAppts(id); // TODO: give data from whenever, data currently is today onward

    //return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("Error inside of api/appointments/[id]: ", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
