import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { users_db } from "@/app/lib/types/user_db";
import bcrypt from "bcryptjs";

// export async function GET(response: Response) {
//   const user: User = await response.json();
//   console.log("Endpoint: ", user);
//   // const ret = await pool.query("SELECT * FROM users WHERE username = ");
//   return NextResponse.json("hey!", { status: 200 });
// }

export async function POST(response: Response) {
  try {
    const body: users_db = await response.json();
    console.log("do we have the pass;", body.hashpass);
    const hashed = await bcrypt.hash(body.hashpass, 10);

    console.log("did we hash?: ", hashed);

    const ret = await pool.query(
      "INSERT INTO users (fullname, username, hashpass, usertype,street1,street2,city,state,zip,phone,email,servicecategory) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 ,$10,$11,$12)",
      [
        body.fullname,
        body.username,
        hashed,
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

export async function PUT(response: Response) {
  const json = await response.json();
  const username = json.username;
  console.log("GET: ", json, username);

  const res = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (res.rowCount === 0) {
    return NextResponse.json("Unauthorized", { status: 401 });
  } else {
    console.log("GOt rows! ", res.rows);
  }

  return NextResponse.json(res.rows[0], { status: 200 });
}
