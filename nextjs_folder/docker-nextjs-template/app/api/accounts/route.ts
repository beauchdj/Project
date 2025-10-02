import { pool } from "@/app/lib/fetching/db";
import { NextResponse } from "next/server";
import { users_db } from "@/app/lib/types/user_db";

export async function POST(response: Response) {
  try {
    const body: users_db = await response.json();

    console.log("body: ", body);

    const ret = await pool.query(
      "INSERT INTO users (fullname, username, hashpass, usertype,street1,street2,city,state,zip,phone,email,servicecategory) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 ,$10,$11,$12)",
      [
        body.fullname,
        body.username,
        body.hashpass,
        body.usertype,
        body.street_1,
        body.street_2 || null,
        body.city,
        body.state,
        body.zip,
        body.phone,
        body.email,
        body.sp_type,
      ]
    );

    console.log("Registered: ", ret);

    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    console.log("Registration error: ", error);
    return NextResponse.json("Error in registration", { status: 500 });
  }
}
