/* Gavin Stankovsky, Jaclyn Brekke
 *  December 2025 (Latest)
 *  Appointment wrap handler functions
 */

"use client";
import CreateApptForm from "./CreateApptForm";
import AppointmentsList from "./AppointmentsList";
import { useEffect, useState } from "react";
import { Appointment } from "../lib/types/Appointment";

export default function AppointmentWrap() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    const params = new URLSearchParams();
    params.set("startAfter", new Date().toISOString());
    const res = await fetch(`/api/appointments?${params.toString()}`, {
      method: "GET",
    });

    if (!res.ok) {
      console.error("Failed to fetch appointments");
      return;
    }
    const json = await res.json();
    setAppointments(json.appointments);
  }

  async function handleCancel(appt: Appointment) {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appt.id ? { ...a, cust_fullname: "", bookingid: null } : a
      )
    );
  }

  async function handleDelete(apptId: string) {
    setAppointments((prev) => prev.filter((appt) => appt.id !== apptId));
    // TODO should set the active field to false?
  }
  function handleError(message: string) {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }

  return (
    <main className="max-w-full flex justify-center overflow-auto z-0">
      <div className="w-[95%] px-4 py-2 bg-emerald-900/90 backdrop-blur-sm p-2 rounded-xl">
        <div className="sticky top-0 ">
          <CreateApptForm setAppointments={setAppointments} />
        </div>
        <div className="my-4 font-semibold text-lg">
          {error && (
            <div className="mb-4 rounded-md bg-red-600/90 text-white px-4 py-2">
              {error}
            </div>
          )}
          <AppointmentsList
            appointments={appointments}
            onCancelAppt={handleCancel}
            onDeleteAppt={handleDelete}
            onError={handleError}
          />
        </div>
      </div>
    </main>
  );
}
