// route for customers to book an appointment and to view their booked appointments

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBookedAppts, bookAppointment } from "@/app/lib/services/appointmentServices";

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

/*
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