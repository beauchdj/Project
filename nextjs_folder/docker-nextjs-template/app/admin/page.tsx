"use server";

import { pool } from "@/lib/db";
import AdminView from "./lib/AdminView";
import { Appointment } from "../lib/types/Appointment";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { NotificationProvider } from "../lib/components/NotificationContext";
import { getAppointments } from "../lib/services/appointmentServices";
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
  const appts: Appointment[] = await getAllApptsJoinSP(session.user.id);

  return (
    <NotificationProvider>
      <AdminView appt_list={appts} />
    </NotificationProvider>
  );
}

//async function getAllApptsJoinSP() {
async function getAllApptsJoinSP(userid?: string) {
  try {
    const appts = await getAppointments({}, userid!);
    // TODO: Should be all appointments, only showing booked right now...
    //const ret = await pool.query(
    //  "SELECT a.id AS sp_id, b.id AS cust_id, appts_avail.service, a.fullname AS sp_fullname, a.servicecategory AS sp_servicecat, a.providername AS sp_providername, b.fullname AS cust_fullname, appts_avail.starttime, appts_avail.endtime FROM appts_avail LEFT JOIN (SELECT DISTINCT apptid, userid FROM appt_bookings) AS uniq ON appts_avail.id = uniq.apptid JOIN users AS a ON appts_avail.spid = a.id LEFT JOIN users AS b on uniq.userid = b.id;"
    //);
    // appts_avail.service, a.fullname AS sp_fullname, a.servicecategory AS sp_servicecat, a.providername AS sp_providername, b.fullname AS cust_fullname, appts_avail.starttime, appts_avail.endtime
    //return ret.rows;
    return appts;
  } catch (error) {
    console.log("Error in getAllApptsJoin() from /app/admin/page.tsx ", error);
    return [];
  }
}
