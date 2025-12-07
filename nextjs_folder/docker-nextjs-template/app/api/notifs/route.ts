/* Jaclyn Brekke
*  December 2025
*  Jaclyn's notification database API
*/

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getNotificationsForUser, updateNotificationStatus} from "../../lib/services/notificationService";

export async function GET(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const notifications = await getNotificationsForUser(session.user.id);
        return NextResponse.json(
            { notifications },
            {status: 200 }
        );
    } catch (error: any) {
        console.error("Get Notifications error:", error);
        return NextResponse.json(
            { message: "Server Error" },
            {status: 500}
        );
    }
}

export async function PATCH (request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const {notifId, isActive, isNew } = await request.json();

    if (!notifId) {
        return NextResponse.json(
            { error: "notifId required" },
            { status: 400 }
        );
    }

    await updateNotificationStatus(notifId, isActive, isNew);
        return NextResponse.json(
                { message: "Notification updated successfully" },
                { status: 200 }
            );
  
}