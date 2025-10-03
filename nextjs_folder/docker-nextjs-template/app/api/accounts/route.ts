import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
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
    const hashed = await bcrypt.hash(body.hashpass, 10);
    // validate the data passed in should prob do this on frontend

    await pool.query(
      "INSERT INTO users (providername, fullname, username, hashpass, isAdmin, isSp, isCustomer,street1,street2,city,state,zip,phone,email,servicecategory,qualifications) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)",
      [
        body.providername,
        body.fullname,
        body.username,
        hashed,
        body.isadmin,
        body.issp,
        body.iscustomer,
        body.street_1,
        body.street_2 || null,
        body.city,
        body.state,
        body.zip,
        body.phone,
        body.email,
        body.sp_type,
        body.qualifications,
      ]
    );
    throw new Error("Some error");

    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    console.log("Registration error: ", error);
    return NextResponse.json("Error in registration", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // should change this to a get with path parameter/query param
  const url = new URL(req.url);
  const params = url.searchParams;
  const username = params.get("username");
  // console.log("this is the url: ", url);
  // console.log("what username: ", username);

  const res = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  if (res.rowCount === 0) return NextResponse.json(null, { status: 401 });

  return NextResponse.json(res.rows[0], { status: 200 });
}
