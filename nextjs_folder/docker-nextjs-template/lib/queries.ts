export const runtime = "nodejs";

import { pool } from "./db";

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

export async function getUser(username: string): Promise<void> {
  console.log("Are we in runtime?: ", isRuntime());
  const res = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  console.log("looked up a user: ", res.rows);
}

export async function getPassword(username: string) {
  try {
    const ret = pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    console.log("got ret getPassword(): ", ret);
  } catch (error) {
    console.log("GOt an error in queries.ts/getPassword() ", error);
  }
}

export function isRuntime(): void {
  if (typeof process === "undefined") {
    console.log("Edge Runtime!");
  } else {
    console.log("Node Runtime!");
  }
}
