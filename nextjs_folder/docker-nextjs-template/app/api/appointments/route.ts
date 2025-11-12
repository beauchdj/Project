// endpoints for service providers to create available appointments and get their appointments (all of them - booked and open)

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createAvailabilitySlot, getAllSpAppts, deleteAvailAppt } from "@/app/lib/services/appointmentServices";

export async function POST(request: Request) {
    const session = await auth();

    if (!session || !session.user.isSp) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });   
    }

    const { service, date, starttime, endtime } = await request.json();

    if (!service || !date || !starttime || !endtime) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const result = await createAvailabilitySlot(session.user.id, service, date, starttime, endtime);
        return NextResponse.json({ apptId: result.apptId }, { status: 201 } );
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });  
    }
}

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