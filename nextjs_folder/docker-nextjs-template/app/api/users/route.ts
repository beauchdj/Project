/* Gavin Stankovsky
*  October 2025
*  Gets list of users, used for testing purposes
*/

/**
 * This route is used under /demo
 *  Show casing server to client side interactions with
 */
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { User } from "next-auth";
import { getAllUsers,createUser,updateUser } from "@/app/lib/services/userService";
import { auth } from "@/auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  const session = await auth();
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

/*
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
}*/

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

/* shouldnt use - only soft delete 
export async function DELETE(request: Request) {
  try {
    const bod = await request.json();
    const username = bod.username;

    await pool.query("DELETE FROM users WHERE username = $1", [username]);

    return NextResponse.json(JSON.stringify({ username: username }), {
      status: 200,
    });
  } catch (error) {
    console.log("Server API: /users DELETE ERROR", error);
    return NextResponse.json("failed", {
      status: 500,
    });
  }
}*/
