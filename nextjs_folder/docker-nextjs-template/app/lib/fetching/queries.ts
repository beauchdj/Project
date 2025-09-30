"use server";
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
  const res = await pool.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  console.log("looked up a user: ", res.rows);
}
