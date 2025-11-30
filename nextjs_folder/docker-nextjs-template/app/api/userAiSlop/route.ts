/*
THIS IS AI GENERATED CODE BY COPILOT
*/

import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { users_db } from "@/app/lib/types/user_db";
import bcrypt from "bcryptjs";

// GET user by username
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE username = $1 LIMIT 1`,
      [username]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user: users_db = result.rows[0];
    return NextResponse.json(user);
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT to update user
export async function PUT(req: Request) {
  const body = await req.json();
  const {
    issp,
    iscustomer,
    servicecategory,
    fullname,
    username,
    hashpass,
    city,
    state,
    zip,
    street1,
    street2,
    phone,
    email,
    qualifications,
    providername,
    newpass,
    isHashed
  } = body;

  var hashedPassword = hashpass;
  if (!isHashed) {
    hashedPassword = await bcrypt.hash(newpass, 10);
  } else {
    hashedPassword = hashpass;
  }

  try {
    await pool.query(
      `UPDATE users
       SET
       issp = $1,
       iscustomer = $2,
       servicecategory = $3,
       fullname = $4,
       username = $5,
       hashpass = $6,
       city = $7,
       state = $8,
       zip = $9,
       street1 = $10,
       street2 = $11,
       phone = $12,
       email = $13,
       qualifications = $14,
       providername = $15
      WHERE username = $5`,
      [
        issp,
        iscustomer,
        servicecategory,
        fullname,
        username,
        hashedPassword,
        city,
        state,
        zip,
        street1,
        street2,
        phone,
        email,
        qualifications,
        providername
      ]
    );


    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}