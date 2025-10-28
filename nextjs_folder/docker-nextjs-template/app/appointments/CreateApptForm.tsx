"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Appointment } from "../lib/types/Appointment";

export default function CreateApptForm({
  setAppointments,
}: {
  setAppointments: Dispatch<SetStateAction<Appointment[]>>;
}) {

  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formEvent = event.currentTarget;

    const formData = new FormData(event.currentTarget);
    const date = formData.get("date") as string;
    const start = formData.get("starttime") as string;
    const end = formData.get("endtime") as string;
    const service = formData.get("service") as string;

    //Validation
    const today = new Date();
    const selectedDate = new Date(date);
    if (selectedDate < today) {
      setError("Appointment date must be today or in the future.");
      return;
    }

    const startTime = convertToISO(date,start);
    const endTime = convertToISO(date,end);
    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service: service,
        date: date,
        starttime: start,
        endtime: end,
      }),
    });

    const { apptId } = await response.json();
    if (!response.ok) {
      setError("The appointment you are trying to create conflicts with an existing appointment.");
      return;
    }
    const newAppt: Appointment = {
      id: apptId,
      starttime: startTime,
      endtime: endTime,
      service: service,
      fullname: "",
    };

    setAppointments((prev) => [...prev, newAppt]);
    formEvent.reset();
  }

  function convertToISO(dateStr: string, timeStr: string) {
    const [year,month,day] = dateStr.split("-").map(Number);
    const [hours, minutes] = timeStr.split(":").map(Number);
   

    const local = new Date(year, month - 1, day, hours, minutes, 0,0);
    local.setHours(hours, minutes, 0, 0);

    const iso = local.toISOString();

    return iso;
  }

  return (
    <div>
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
    
    {error && (
      <p className="text-red-400 mt-2 text-sm font-medium">
        {error}
      </p>
    )}
</div>
  );
}
