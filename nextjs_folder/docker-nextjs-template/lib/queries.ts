"use server";
import { pool } from "./db";

// import { pool } from "./db";

export async function fetchUsers() {
  return await fetch("http://localhost:3000/api/users")
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch((err) => console.log("ERROR: ", err));
}

export async function fetchData() {
  try {
    const response = await fetch(
      "https://baconipsum.com/api/?type=all-meat&paras=8&format=json"
    );
    if (!response.ok) throw new Error(`Http error: status: ${response.status}`);

    return response;
  } catch (error) {
    console.error("Fetch failed: ", error);
  }
}

// export async function getUser(username: string): Promise<void> {
//   const res = await pool.query(`SELECT * FROM users WHERE username = $1`, [
//     username,
//   ]);
// }

// export function isRuntime(): void {
//   if (typeof process === "undefined") {
//     console.log("Edge Runtime!");
//   } else {
//     console.log("Node Runtime!");
//   }
// }

export async function addNotification(apptid: string): Promise<void> {
  // const resp = await pool.query(
  //   "UPDATE appt_bookings SET bookstatus = 'Canceled' WHERE appt_bookings.apptid = $1 RETURNING id",
  //   [apptid]
  // );
  // console.log("TELLEME: ", resp);
  // const response = await pool.query(
  //   "INSERT INTO notifications (apptid, status) VALUES ($1, 'Canceled') RETURNING apptid",
  //   [apptid]
  // );
  // console.log("ISNERT RESP: ", response);
}
