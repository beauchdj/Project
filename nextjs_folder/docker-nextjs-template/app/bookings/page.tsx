"use server";
import { auth } from "../../auth"
import { redirect } from "next/navigation";
import BookingClient from "./BookingClient";

export default async function Page() {
    const session = await auth()
    if (!session) redirect("/login");
  
    return (
     <main className="w-full bg-emerald-900 text-white px-4 py-3">
      <div>
        <h1 className="text-lg font-semibold mb-3">Find and Book Appointments</h1>
        <BookingClient />
      </div>
    </main>
  );
}