/* Gavin Stankovsky, Jaclyn Brekke
 *  December 2025 (Latest)
 *
 * A service provider view of their upcoming appointment slots
 *   If a slot is booked, it will display the customer name
 *   Booked slots will also display a button to cancel the booking
 *   Unbooked slots will display a button to delete the appointment so it is no longer available to book.
 */

"use client";

import { Appointment } from "../lib/types/Appointment";
import CancelApptButton from "./CancelApptButton";
import DeleteApptButton from "./DeleteApptButton";

export default function AppointmentsList({
  appointments,
  onCancelAppt,
  onDeleteAppt,
  onError,
}: {
  appointments: Appointment[];
  onCancelAppt: (appt: Appointment) => void;
  onDeleteAppt: (apptId: string) => void;
  onError: (message: string) => void;
}) {
  if (!appointments.length) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
        <p>None</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Date</th>
              <th className="px-3 py-2 text-left font-semibold">Start</th>
              <th className="px-3 py-2 text-left font-semibold">End</th>
              <th className="px-3 py-2 text-left font-semibold">Service</th>
              <th className="px-3 py-2 text-left font-semibold">Customer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {appointments.map((row, i) => {
              const customer = row.cust_fullname ?? "";
              return (
                <tr key={row.id ?? i} className="hover:bg-white/5">
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {new Date(row.starttime).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {new Date(row.starttime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {new Date(row.endtime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2">{row.service}</td>
                  <td className="px-3 py-2">
                    {customer || <span className="opacity-60">—</span>}
                  </td>
                  {customer && (
                    <td className="px-3 py-2">
                      <CancelApptButton
                        appointment={row}
                        onSuccess={() => onCancelAppt(row)}
                        onError={onError}
                      />
                    </td>
                  )}
                  {!customer && (
                    <td className="px-3 py-2">
                      <DeleteApptButton
                        apptId={row.id!}
                        onSuccess={() => onDeleteAppt(row.id!)}
                        onError={onError}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
