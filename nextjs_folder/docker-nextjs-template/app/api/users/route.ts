import { NextResponse } from "next/server";
import { pool } from "@/app/lib/fetching/db";
import { User } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  try {
    await pool.connect();
    const res = await pool.query("SELECT * FROM users");

    console.log("This was the request: ", res.rows);
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
  const body: User & { password: string } = await request.json(); // & { password: string } adds password variable onto User object
  console.log("This is the posted body: ", body);

  const created = { username: body.username, password: body.password };
  const id = crypto.randomUUID();
  const res = await pool.query(
    `INSERT INTO users (username, password) VALUES ($1,$2,$3)`,
    [created.username, created.password, id]
  );
  console.log("This is from post: ", res);

  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request: Request) {
  const bod = await request.json();
  const username = bod.username;
  console.log("dELETE: ", bod);

  const res = await pool.query("DELETE FROM users WHERE username = $1", [
    username,
  ]);

  return NextResponse.json(JSON.stringify(username), { status: 200 });
}
