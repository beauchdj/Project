/* Route initially created by Gavin Stankovsky
*  October 2025
*  Gets list of users, used for testing purposes
* This route is used under /demo
 *  Show casing server to client side interactions with
*  
* 
* 
*  Repurposed by Jaclyn Brekke
*  December 2025
*  Now used in production
* 

**********************************************************************************************/
import { NextResponse } from "next/server";
import { getAllUsers,createUser,updateUser } from "@/app/lib/services/userService";
import { auth } from "@/auth";
/************ GET /api/users  *****************************************************************
 * returns a list of all users in the system
 * requires that actor requesting has admin status
 * Successful response (200): Response body is an object with a users array. Each item matches the User type.
 * 
 * Errors:
 *      - 401 Unauthorized
 *      - 403 Forbidden (not an admin)
 *      - 500 Server error
***********************************************************************************************/

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  if (!session?.user?.isAdmin) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const users = await getAllUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Get /users error:", error);
    return NextResponse.json(
      { error: "failed to fetch users" },
      { status: 500 }
    );
  }
}

/****************  PATCH /api/users*****************************************
 * Updates an existing user record.
 *  - Admins:
 *      - Can update any user.
 *  - Non-admin users:
 *      - May update their own user record only.
 *
 * Request body:
 *  - userId: id of the user being updated (required)
 *  - All additional fields are treated as partial updates
 *
 * Authorization rules are applied before any updates.
 *
 * Successful response (200):
 *  - Response body is the updated User record.
 *
 * Errors:
 *  - 400 Bad Request (userId missing)
 *  - 401 Unauthorized (not authenticated)
 *  - 403 Forbidden (attempting to update another user)
 *  - 404 Not Found (user does not exist)
 *  - 500 Internal server error
 ********************************************************************************/
export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, ...updates } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    if (!session.user.isAdmin && session.user.id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await updateUser(session.user.id, {
    id: userId,
    ...updates,
  });
    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return NextResponse.json(
        {error: "User not found" },
        { status: 404 }
      );
    }

    console.error("PATCH /users error:", error);
    return NextResponse.json(
      {error: "Failed to update user status"},
      {status:500}
    );
  }
}

/* original from Gavin
export async function POST(request: Request) {
  try {
    const body: User & { password: string } = await request.json(); // & { password: string } adds password variable onto User object

    const created = { username: body.username, password: body.password };

    await pool.query(
      `INSERT INTO users (fullname, username, hashpass) VALUES ($1, $2, $3)`,
      [created.username, created.username, created.password]
    );

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.log("/users POST ERROR: ", error);
    return NextResponse.json("failed", { status: 500 });
  }
}

// account route is currently used to create a user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await createUser(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: "Error creating user" },
      { status: 500 }
    );
  }
}

*/