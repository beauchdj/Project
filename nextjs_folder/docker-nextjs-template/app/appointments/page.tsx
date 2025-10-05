// In the Next.js App Router (used by Next.js 13+), every file in /app
// represents a "route segment" (or page) automatically mapped to a URL.
// This page file corresponds to the route /appointments.
//
// By default, files in /app are **Server Components**.
// That means they run on the server — they can directly access
// environment variables, databases, and other backend code
// without being sent to the browser.
//
// Here, we use this file as a simple wrapper that renders a client
// component for interactivity (our form).

import CreateAppointmentForm from "./CreateAppointmentForm";
import { auth } from "../../auth"
import { redirect } from "next/navigation";

export default async function AppointmentsPage() {

    const session = await auth()
    if (!session) redirect("/login");
    if (!session.user.isSp) redirect("/");
     // This is a **Server Component**. It executes only on the server
     // and sends pre-rendered HTML to the browser.
     // It’s not interactive by itself — it just provides the layout.
         
    return (
    <main className="max-w-full px-4 py-2">
        <div className="sticky top-0 z-10 bg-emerald-900/90 backdrop-blur-sm p-2">
            {/* The actual form lives in a "Client Component" because it uses
                React hooks (useState, useRouter) and browser APIs (fetch). */}
            <CreateAppointmentForm />
        </div>

        <section className="mt-4">
            Upcoming Appointments List
        </section>
    </main>
  );
}
