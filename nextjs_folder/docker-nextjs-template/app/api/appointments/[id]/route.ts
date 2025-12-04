import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateAppointmentSlot } from "@/app/lib/services/appointmentServices";

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
