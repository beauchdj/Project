"use server";

import { pool } from "@/lib/db";
import AdminView from "./lib/AdminView";
import { Appointment } from "../lib/types/Appointment";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NotificationProvider } from "../lib/components/NotificationContext";

/**
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
    // TODO: Should be all appointments, only showing booked right now...
    const ret = await pool.query(
      "SELECT service,starttime,endtime,a.servicecategory AS sp_servicecat,a.providername AS sp_providername,a.fullname AS sp_fullname, b.fullname AS cust_fullname FROM appts_avail JOIN users AS a ON appts_avail.spid = a.id LEFT JOIN appt_bookings ON appts_avail.id = appt_bookings.apptid JOIN users AS b ON appt_bookings.userid = b.id;"
    );
    console.log(ret.rows);
    return ret.rows;
  } catch (error) {
    console.log("Error in getAllApptsJoin() from /app/admin/page.tsx ", error);
    return [];
  }
}
