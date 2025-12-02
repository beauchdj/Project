// endpoints for service providers to create available appointments and get their appointments (all of them - booked and open)

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAppointments, createAppointmentSlot,deleteAppointmentSlot } from "@/app/lib/services/appointmentServices";
import {AppointmentFilters} from "../../lib/types/AppointmentFilters";

export async function GET(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const filters: AppointmentFilters = {
        serviceProviderId: searchParams.get("serviceProviderId") ?? undefined,
        status: searchParams.get("status") as AppointmentFilters["status"] | undefined,
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

/*
export async function GET(request: Request) {
    const session = await auth();
    if (!session || !session.user.isSp) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const result = await getAllSpAppts(session.user.id);
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

    const { apptId } = (await request.json()) as { apptId: string };

    if (!apptId) {
        return NextResponse.json({ error: "Missing apptId" }, { status: 400 });
    }

    try {
        const result = await deleteAvailAppt(apptId, session.user.id);
        return NextResponse.json(result, {status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
    */