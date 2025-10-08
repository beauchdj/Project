//TODO:
// add other search filters to look for appointments
// make category search filter a dropdown
// add date column
// pretty format times
// check for conflicts when booking
// auto-refresh available appointments and good messaging when booked (or not)
// decide where the list of booked appointments should live
// error handling, loading state, redirection

"use server";
import { pool } from "@/lib/db";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import BookingClient from "./BookingClient";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <main className="w-full bg-emerald-900 text-white px-4 py-3">
      <div>
        <h1 className="text-lg font-semibold mb-3">
          Find and Book Appointments
        </h1>
        <BookingClient />
      </div>
    </main>
  );
}
