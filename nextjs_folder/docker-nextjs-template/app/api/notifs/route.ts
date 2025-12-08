/*****************************************************************************************************************
 * Jaclyn Brekke
 * December 2025
 * 
 * Notifications API
 * 
 * General Notes:
 * All notification endpoints require authentication. 
 * If the user is not authenticated, the API will return HTTP 401 Unauthorized.
 * Authorization rules are enforced by the backend. 
 * Notifications are only created on the backend in response to booking actions, so the only exposed operations are reading and updating notification status.
**********************************************************************************************************************/
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getNotificationsForUser, updateNotificationStatus} from "../../lib/services/notificationService";

/*************** GET /api/notifs *******************************************
 * Returns a list of active notifications that have been sent to a user
 * Successful response (200): The response body contains an object with a notifications array. 
 *  Each notification has an id, the message, an isactive and isnew field
 * Errors
 *  401 Unauthorized
 *  500 Server Error
****************************************************************************************/
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

/*************** PATCH /api/notifs *******************************************
 * Updates a notification's isActive and isNew status
 * Used when a user "clears" a notification so they no longer see it
 * Successful response (200): Returns a message "Notification updated successfully"
 * 
 * Errors
 *  401 Unauthorized
 *  400 Invalid Request (notification Id required)
****************************************************************************************/
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