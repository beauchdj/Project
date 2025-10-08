// route for customers to book an appointment and to view their booked appointments

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBookedAppts, bookAppointment } from "@/app/lib/services/appointmentServices";

export async function POST(request: Request) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });   
    }

    // get appt id sent in request
    let apptId: string;
    // check validity of apptid

    try {
        const result = await bookAppointment(apptId, session.user.id);
        return NextResponse.json({  }, { status: 201 } );
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });  
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