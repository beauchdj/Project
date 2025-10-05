// This file defines the HTTP handler for requests to /api/appointments
// Each HTTP verb (GET, POST, etc) is exported as a function

import { NextResponse } from "next/server"; // Utility to send HTTP responses
import { auth } from "@/auth";
import { createAvailabilitySlot } from "@/app/lib/services/appointmentService";

export async function POST(req: Request) {
    // Route handlers receive a 'Request' object, similar to the Fetch API.
    // YOu can call req.json(), req.formData(), req.headers, etc.

    // Step 1: Check authentication and role
    const session = await auth(); // NextAut helper to verify current session

    // If user is missing or not a service provider, block the request
    if (!session || !session.user?.isSp) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if (!session.user.id) {
        return NextResponse.json({ error: "Invalid provider id." }, { status: 400});
    }

    // Step 2: Parse JSON body
    let body: unknown;
    try {
        body = await req.json(); // Parse request JSON payload
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Step 3: Delegate all real work to the service layer
    try {
        const result = await createAvailabilitySlot(session.user.id,body);

        // Step 4: Respond with JSON; 201 = Created
        return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
    } catch (err: unknown) {
        // Step 5: Map service errors to HTTP responses
        const msg = String(err); 
        if (msg.startsWith("VALIDATION:"))
            return NextResponse.json({ error: msg.replace("VALIDATION:", "") }, { status: 400 });
        if (msg.startsWith("CONFLICT:"))
            return NextResponse.json({ error: msg.replace("CONFLICT:", "") }, { status: 409 });
        if (msg.startsWith("SERVER:"))
            return NextResponse.json({ error: msg.replace("SERVER:", "") }, { status: 500 });
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}
