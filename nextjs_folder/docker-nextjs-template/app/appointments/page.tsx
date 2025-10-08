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
import CreateApptForm from "./CreateApptForm";
import AppointmentsList from "./AppointmentsList";

export default async function CreateAppointmentsPage() {
  const session = await auth();
  console.log("Hit sesison check: ", session);
  if (!session) redirect("/login");
  if (!session.user.isSp) redirect("/");

  return (
    <main className="max-w-full px-4 py-2">
      <div className="sticky top-0 z-0 bg-emerald-900/90 backdrop-blur-sm p-2">
        <CreateApptForm />
      </div>
      <div className="my-4 font-semibold text-lg">
        <AppointmentsList />
      </div>
    </main>
  );
}
