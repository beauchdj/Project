/* Gavin Stankovsky, Jaclyn Brekke
*  December 2025 (Latest)
*  Appointment creation page
*/

"use server";

import { auth } from "../../auth";
import { redirect } from "next/navigation";
import AppointmentWrap from "./AppointmentWrap";

export default async function CreateAppointmentsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (!session.user.isSp) redirect("/");
  return <AppointmentWrap />;
}
