"use client";
import { formatter } from "../lib/types/Formatter";
import { Appointment } from "../lib/types/Appointment";

export default function AppointmentsList({
  appointments,
}: {
  appointments: Appointment[];
}) {
  if (!appointments.length) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-2">Available Appointments</h2>
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">All Appointments</h2>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Start</th>
              <th className="px-3 py-2 text-left font-semibold">End</th>
              <th className="px-3 py-2 text-left font-semibold">Service</th>
              <th className="px-3 py-2 text-left font-semibold">Customer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {appointments.map((row, i) => {
              const customer = row.fullname ?? "";
              return (
                <tr key={row.id ?? i} className="hover:bg-white/5">
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {formatter.format(new Date(row.starttime))}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {formatter.format(new Date(row.endtime))}
                  </td>
                  <td className="px-3 py-2">{row.service}</td>
                  <td className="px-3 py-2">
                    {customer || <span className="opacity-60">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
