/* Jaclyn Brekke, Gavin Stankovsky
*  November 2025
*  Appointment booking page
*/

"use server";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
import BookingClient from "./BookingClient";
import { NotificationProvider } from "../lib/components/NotificationContext";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <NotificationProvider>
      <main className="flex items-center justify-center w-full">
        <div className="w-[95%] bg-emerald-900 text-white px-4 py-4 rounded-xl">
          <h1 className="text-lg font-semibold mb-3">
            Find and Book Appointments
          </h1>
          <BookingClient />
        </div>
      </main>
    </NotificationProvider>
  );
}
