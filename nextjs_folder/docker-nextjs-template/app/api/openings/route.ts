// route for customers to get available appointments


import { NextResponse, NextRequest } from "next/server";
import { getAllAvailAppts } from "@/app/lib/services/appointmentServices";

export async function GET(request: NextRequest) {
    const category = request.nextUrl.searchParams.get("category");
   
     try {
    const result = await getAllAvailAppts(category ?? null);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}