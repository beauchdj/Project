"use server";

import { pool } from "@/lib/db";
import AdminView from "./lib/AdminView";
import { Appointment } from "../lib/types/Appointment";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 *
 * Common nextjs pattern is fetch data on server component (page.tsx)
 *  then use client components to manipulate that passed data and mirroring the client
 *  operations to the server with api calls
 */
// export: allow the current page, allowing other files to import this file.
// default: this is what tells nextjs which react component to show as the root component on this route (/demo)
export default async function Page() {
  const session = await auth();
  if (!session?.user || !session?.user.isAdmin) redirect("/");
  const ret = await pool.query(
    "SELECT * FROM appts_avail JOIN users on users.id = appts_avail.spid"
  );
  const appts: Appointment[] = ret.rows;
  return <AdminView appt_list={appts} />;
}
