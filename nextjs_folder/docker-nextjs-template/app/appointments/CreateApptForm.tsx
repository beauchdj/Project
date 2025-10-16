"use client";

import { Dispatch, SetStateAction } from "react";
import { Appointment } from "../lib/types/Appointment";

export default function CreateApptForm({
  setAppointments,
}: {
  setAppointments: Dispatch<SetStateAction<Appointment[]>>;
}) {
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service: formData.get("service"),
        date: formData.get("date"),
        starttime: formData.get("starttime"),
        endtime: formData.get("endtime"),
      }),
    });

    const { apptId } = await response.json();

    const start = convertToISO(formData.get("starttime") as string);
    const end = convertToISO(formData.get("endtime") as string);

    const newAppt: Appointment = {
      id: apptId,
      starttime: start,
      endtime: end,
      service: formData.get("service") as string,
      fullname: "",
    };

    setAppointments((prev) => [...prev, newAppt]);
  }

  function convertToISO(str: string) {
    const [hours, minutes] = str.split(":").map(Number);

    const local = new Date();
    local.setHours(hours, minutes, 0, 0);

    const iso = local.toISOString();

    return iso;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap items-center gap-2 bg-emerald-800/60 p-2 rounded-lg text-sm"
    >
      <input
        name="date"
        type="date"
        required
        className="rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <input
        name="starttime"
        type="time"
        required
        className="rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <input
        name="endtime"
        type="time"
        required
        className="rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <input
        name="service"
        type="text"
        placeholder="Service Description"
        required
        className="w-36 md:w-48 rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />

      <button
        type="submit"
        className="
                    bg-emerald-600 hover:bg-emerald-500
                    text-white font-semibold
                    px-3 py-1 rounded-md
                    transition
                disabled:opacity-50 cursor-pointer"
      >
        Create
      </button>
    </form>
  );
}
