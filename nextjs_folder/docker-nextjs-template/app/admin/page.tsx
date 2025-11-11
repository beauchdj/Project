"use server";

import { pool } from "@/lib/db";
import AdminView from "./lib/AdminView";
import { Appointment } from "../lib/types/Appointment";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NotificationProvider } from "../lib/components/NotificationContext";

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
  const appts: Appointment[] = await getAllApptsJoinSP();
  return (
    <NotificationProvider>
      <AdminView appt_list={appts} />
    </NotificationProvider>
  );
}

async function getAllApptsJoinSP() {
  try {
    const ret = await pool.query(
      "SELECT * FROM appts_avail JOIN users on users.id = appts_avail.spid"
    );

    return ret.rows;
  } catch (error) {
    console.log("Error in getAllApptsJoin() from /app/admin/page.tsx ", error);
    return [];
  }
}
