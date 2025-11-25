import { getAllSpAppts } from "@/app/lib/services/appointmentServices";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

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
    const result = await getAllSpAppts(id);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("Error inside of api/appointments/[id]: ", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
