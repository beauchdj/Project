import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cancelBookedAppt } from "@/app/lib/services/appointmentServices";

export async function PUT(request : Request, { params }: { params: { id: string } }) {
    const session = await auth();
        if (!session) {
            return NextResponse.json({error: "Unauthorized" }, { status: 401 });
        }
    const bookingId = params.id
    if (!bookingId) {
        return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    try {
        const result = await cancelBookedAppt(bookingId, session.user.id);
        return NextResponse.json(result, {status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}