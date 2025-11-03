"use client";
import CreateApptForm from "./CreateApptForm";
import AppointmentsList from "./AppointmentsList";
import { useEffect, useState } from "react";
import { Appointment } from "../lib/types/Appointment";

export default function AppointmentWrap() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // prints in the browser console
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    const res = await fetch("/api/appointments", { method: "GET" });
    const json: Appointment[] = await res.json();
    setAppointments(json);
  }

  async function handleCancel(apptId: string) {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === apptId ? { ...appt, fullname: "" } : appt
      )
    );
  }

  async function handleDelete(apptId: string) {
    setAppointments((prev) => prev.filter((appt) => appt.id !== apptId));
  }

  return (
    <main className="max-w-full flex justify-center overflow-auto z-0">
      <div className="w-[95%] px-4 py-2 bg-emerald-900/90 backdrop-blur-sm p-2 rounded-xl">
        <div className="sticky top-0 ">
          <CreateApptForm setAppointments={setAppointments} />
        </div>
        <div className="my-4 font-semibold text-lg">
          <AppointmentsList
            appointments={appointments}
            onCancelAppt={handleCancel}
            onDeleteAppt={handleDelete}
          />
        </div>
      </div>
    </main>
  );
}
