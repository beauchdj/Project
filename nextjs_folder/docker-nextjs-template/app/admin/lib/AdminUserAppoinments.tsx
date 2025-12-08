"use client";

import AppointmentsList from "@/app/appointments/AppointmentsList";
import BookedApptsList from "@/app/bookings/BookedApptList";
import { useNotification } from "@/app/lib/components/NotificationContext";
import { Appointment } from "@/app/lib/types/Appointment";
import { Booking } from "@/app/lib/types/Booking";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AdminUserAppointments() {
  const { id } = useParams(); // the id of who we clicked on?
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  const { toggleHidden } = useNotification();

  async function handleCancel(appt: Appointment) {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appt.id ? { ...a, cust_fullname: "", bookingid: null } : a
      )
    );
    toggleHidden("Appointment Cancelled");
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleBookingCancel(booking: Booking) {
    toggleHidden("Booking Cancelled");
  }

  // async function handleCancel(booking: Booking) {}
  async function handleDelete(apptId: string) {
    setAppointments((prev) => prev.filter((appt) => appt.id !== apptId));
    toggleHidden("Appointment Deleted");
  }
  function handleError(message: string) {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }

  useEffect(() => {
    fetchBookings();
    fetchAppointments(id as string);
  }, []);

  async function fetchBookings() {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "GET",
    });
    const json: Booking[] = await res.json();
    setBookings(json);
  }
  async function fetchAppointments(id: string): Promise<void> {
    // const res = await fetch(`/api/appointments/${id}`, { method: "GET" });
    const res = await fetch(`/api/appointments/${id}`);
    const data: Appointment[] = await res.json();
    setAppointments(data);
  }

  return (
    <div className=" w-full px-6">
      <div className="bg-emerald-800 rounded-xl p-4">
        <AppointmentsList
          appointments={appointments}
          onCancelAppt={handleCancel}
          onDeleteAppt={handleDelete}
          onError={handleError}
        />
        <BookedApptsList
          bookings={bookings}
          onCancel={handleBookingCancel}
          onError={handleError}
        ></BookedApptsList>
      </div>
    </div>
  );
}
