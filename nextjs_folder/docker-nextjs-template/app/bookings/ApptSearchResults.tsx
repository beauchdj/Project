/* Jaclyn Brekke
*  November 2025
*  Appointment search results 
*/

"use client";

import { Booking } from "../lib/types/Booking";
import BookApptButton from "./BookApptButton";
import { Appointment } from "../lib/types/Appointment";

export default function ApptSearchResults({
  data,
  onBooked,
  onError,
}: {
  //data: Booking[];
  data: Appointment[];
  onBooked: (apptId: string) => void;
  onError: (message: string) => void;
}) {
  if (!data) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-2">Available Appointments</h2>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-lg font-semibold mb-2">Available Appointments</h2>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-900/10">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Date</th>
              <th className="px-3 py-2 text-left font-semibold">Start</th>
              <th className="px-3 py-2 text-left font-semibold">End</th>
              <th className="px-3 py-2 text-left font-semibold">
                Service Description
              </th>
              <th className="px-3 py-2 text-left font-semibold">Provider</th>
              <th className="px-3 py-2 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((row) => {
              return (
                <tr key={row.id} className="hover:bg-white/5">
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {new Date(row.starttime!).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {new Date(row.starttime!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {new Date(row.endtime!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2">{row.service}</td>
                  <td className="px-3 py-2">{row.sp_providername}</td>
                  <td className="px-3 py-2">
                    <BookApptButton
                      apptId={row.id!}
                      onSuccess={() => onBooked(row.id!)}
                      onError={onError}
                    />
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
