/**
 * This route is used under /demo
 *  Show casing server to client side interactions with
 */
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { User } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  try {
    await pool.connect();
    const res = await pool.query("SELECT * FROM users");

    return NextResponse.json(res.rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failed to fetch users" },
      { status: 500 }
    );
  }
}

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

/**
 * When we deactivate a user if they are service provider
 *  its important to cancel all appointments and cancel all
 *  booked appointments if they are also a customer
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") as string;
    const isactive = searchParams.get("isactive")!;
    const negate: boolean = isactive[0] === "t" ? true : false;

    await pool.query("UPDATE users SET isactive = $1 WHERE users.id = $2", [
      !negate,
      id,
    ]);

    return NextResponse.json({
      status: 204,
    });
  } catch (error) {
    console.log("Server API: /users DELETE ERROR", error);
    return NextResponse.json("failed", {
      status: 500,
    });
  }
}
