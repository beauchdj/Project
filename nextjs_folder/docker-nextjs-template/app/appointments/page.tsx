import { auth } from "../../auth"
import { redirect } from "next/navigation";
import CreateApptForm from "./CreateApptForm";

export default async function CreateAppointmentsPage() {
  const session = await auth()
  if (!session) redirect("/login");
  if (!session.user.isSp) redirect("/");
  
  return (
     <main className="max-w-full px-4 py-2">
        <div className="sticky top-0 z-10 bg-emerald-900/90 backdrop-blur-sm p-2">
          <CreateApptForm />
        </div>
        <div>
          Upcoming Appointments List (coming soon...)
        </div>
      </main>
  )
}