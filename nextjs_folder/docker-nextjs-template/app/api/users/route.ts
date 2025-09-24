import { NextResponse } from "next/server";
import { pool } from "@/app/lib/fetching/db";

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
