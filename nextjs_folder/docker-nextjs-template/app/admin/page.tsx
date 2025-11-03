"use server";

import { pool } from "@/lib/db";
import AdminView from "./lib/AdminView";
import { Appointment } from "../lib/types/Appointment";

/**
 *
 * Common nextjs pattern is fetch data on server component (page.tsx)
 *  then use client components to manipulate that passed data and mirroring the client
 *  operations to the server with api calls
 */

// export: allow the current page, allowing other files to import this file.
// default: this is what tells nextjs which react component to show as the root component on this route (/demo)
export default async function Page() {
  // const str = "hot reload";
  // console.log("DATA: ", data);
  const ret = await pool.query("SELECT * FROM appts_avail");
  console.log("GOT DATA: ", ret.rows);
  const appts: Appointment[] = ret.rows;

  return <AdminView appt_list={appts} />;
}
