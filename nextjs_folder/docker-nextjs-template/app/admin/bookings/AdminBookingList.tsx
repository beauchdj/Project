/*
 * Jaclyn Brekke
 * December 2025
 * 
 * Page for admins to view and manage all appointments and bookings.
 * This view will display each booking of the Booking type:
 * - Appointments that are currently booked
 * - Appointments that have been cancelled
 * - Available appointment slots (never booked)
 * 
 *  Known Issues: If an appointment has been booked and then cancelled, the appointment will show up as cancelled,
 *  but it will not also appear in a row as an available slot. 
 * 
 * On this page, admins can:
 * - Search bookings by customer name and service provider name.
 * - Cancel currently booked appointments (sets booking status to "Cancelled")
 * - "Delete" open appointment slots (sets appointment isactive to false)
 */

"use client";

import { useEffect, useState } from "react";
import { Booking } from "../../lib/types/Booking";

export default function AdminBookingList() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [customerSearch, setCustomerSearch] = useState("");
    const [providerSearch, setProviderSearch] = useState("");
  
    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        const res = await fetch("/api/bookings?viewAs=Admin", { method: "GET" });
        const json = await res.json();
        setBookings(json.bookings);
    }

    async function cancelBooking(bookingId: string) {
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({status: "Cancelled"})
        });

        if (!response.ok) {
            console.error("Cancel failed");
            return;
        }

        setBookings((prev) =>
            prev.map((b) =>
            b.id === bookingId ? {...b, bookstatus: "Cancelled" } : b
            )
        );
    }

    async function deleteAppointment(apptId: string) {
        const response = await fetch(`/api/appointments/${apptId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isactive: false })
        });

        if (!response.ok) {
            console.error("Delete failed");
            return;
        }
        setBookings((prev) =>
            prev.map((b) =>
            b.apptid === apptId ? { ...b, isactive: false } : b
            )
        );
    }

    let visibleBookings = bookings;
    const customerTerm = customerSearch.trim().toLowerCase();
    const providerTerm = providerSearch.trim().toLowerCase();

    if (customerTerm || providerTerm) {
        visibleBookings = bookings.filter((b) => {
        if (customerTerm) {
            if (!b.fullname || !b.bookstatus) return false;
            if (!b.fullname.toLowerCase().includes(customerTerm)) return false;
        }
    
    if (providerTerm) {
      if (!b.providername) return false;
      if (!b.providername.toLowerCase().includes(providerTerm)) return false;
    }
    return true;
  });
}   
  
  if (!bookings.length) {
    return (
      <div>
         <h2 className="text-lg font-semibold mb-4 text-white">
        All Appointment Bookings
      </h2>
        <p>None</p>
      </div>
    );
  }
  return (
  <div className="p-6">
     <h2 className="text-lg font-semibold mb-4 text-white">
        All Appointment Bookings
      </h2>
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
                type="text"
                placeholder="Search customers..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="
                    w-full sm:w-1/2 px-4 py-2 rounded-md
                    bg-emerald-900 text-white
                    border border-white/20
                    placeholder-white/50
                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                    "
            />
            <input
                type="text"
                placeholder="Search service providers..."
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
                className="
                    w-full sm:w-1/2 px-4 py-2 rounded-md
                    bg-emerald-900 text-white
                    border border-white/20
                    placeholder-white/50
                    focus:outline-none focus:ring-2 focus:ring-emerald-500
                    "
            />
        </div>
    </div>
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-emerald-800 shadow-lg">
      <table className="min-w-full text-sm text-white">
        <thead className="bg-emerald-900">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Customer Name</th>
            <th className="px-4 py-3 text-left font-semibold">Provider name</th>
            <th className="px-4 py-3 text-left font-semibold">Service</th>
            <th className="px-4 py-3 text-left font-semibold">Date</th>
            <th className="px-4 py-3 text-left font-semibold">Start</th>
            <th className="px-4 py-3 text-left font-semibold">End</th>
            <th className="px-4 py-3 text-left font-semibold">BookingStatus</th>
            <th className="px-4 py-3 text-left font-semibold">ApptStatus</th>
            <th className="px-4 py-3 text-left font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {visibleBookings.map((booking) => (
            <tr key={booking.id ?? booking.apptid}
              className="hover:bg-emerald-700 transition-colors"
            >
              <td className="px-4 py-2 text-xs">{booking.fullname}</td>
              <td className="px-4 py-2 text-xs">{booking.providername}</td>
              <td className="px-4 py-2 text-xs">{booking.service}</td>
              <td className="px-4 py-2 text-xs">
                  {new Date(booking.starttime).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                    })}
               </td>
               <td className="px-4 py-2 text-xs">
                  {new Date(booking.starttime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
               </td>
               <td className="px-4 py-2 text-xs">
                  {new Date(booking.endtime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
               </td>
              <td className="px-4 py-2 text-xs">{booking.bookstatus || "Available"}</td>
              <td className="px-4 py-2 text-xs">{booking.isactive ? "active" : "deleted"}</td>
              <td className="px-4 py-2">
                {booking.bookstatus === "Booked" ? (
                  <button
                    onClick={() =>
                      cancelBooking(booking.id)
                    }
                    className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 transition"
                  >
                    Cancel Booking
                  </button>
                ) : booking.isactive ? (
                    <button
                     onClick={() =>
                        deleteAppointment(booking.apptid)
                     }
                     className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 transition"
                     >
                       Delete Slot
                    </button>) : ""
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}