import { auth } from "../../auth"
import { redirect } from "next/navigation";
import CreateApptForm from "./CreateApptForm";
import AppointmentsList from "./AppointmentsList";

export default async function CreateAppointmentsPage() {
  const session = await auth()
  if (!session) redirect("/login");
  if (!session.user.isSp) redirect("/");
  
  return (
    <main className="max-w-full px-4 py-2">
      <div className="sticky top-0 z-10 bg-emerald-900/90 backdrop-blur-sm p-2">
        <CreateApptForm />
      </div>
      <div className="my-4 font-semibold text-lg">
        <AppointmentsList />
      </div>
    </main>
  )
}