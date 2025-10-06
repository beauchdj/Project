import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { bookAppointment} from "@/app/lib/services/appointmentService";

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, {status: 401 });
    }

    let body: any; 
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON"  }, { status: 400 });
    }

    const apptId = String(body?.apptId || "");
    const customerId = String(session.user?.id || ""); // UUID of the booking user

    if (!apptId) {
        return NextResponse.json({ error: "Appointment id required." }, { status: 400 });
    }

    try {
        const bookingId = await bookAppointment({ apptId, customerId });
        return NextResponse.json({ ok: true, id: bookingId }, { status: 201 });
    } catch (err: any) {
        if (process.env.NODE_ENV !== "production") {
            console.error("BOOKING ERROR:", {
            code: err?.code,
            constraint: err?.constraint,
            message: err?.message,
            err
            });
        }
        const msg = String(err);
        if (msg.startsWith("VALIDATION:"))
            return NextResponse.json({ error: msg.replace("VALIDATION:", "") }, { status: 400 });
        if (msg.startsWith("CONFLICT:"))
            return NextResponse.json({ error: msg.replace("CONFLICT:", "") }, { status: 409 });
        return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}