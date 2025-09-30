import { pool } from "@/app/lib/fetching/db";
import { NextResponse } from "next/server";

type db = {
  fullname: string;
  username: string;
  hashpass: string;
  usertype: string;
};

export async function POST(response: Response) {
  const body: db = await response.json();

  console.log("got body: ", body);

  // await pool.query(
  //   "INSERT INTO users (fullname, username, hashpass, usertype) VALUES ($1, $2, $3, $4)",
  //   [body.fullname, body.username, body.hashpass, body.usertype]
  // );

  return NextResponse.json(body, { status: 200 });
}
