"use server";
//TODO:
// add date column
// pretty format times
// add button to delete available appt (and create api endpoints)
// sort/filter/paginate appointment list
// check for conflicts when creating appointments
// error handling, loading state, redirection

import { auth } from "../../auth";
import { redirect } from "next/navigation";
import AppointmentWrap from "./AppointmentWrap";

export default async function CreateAppointmentsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (!session.user.isSp) redirect("/");
  return <AppointmentWrap />;
}
