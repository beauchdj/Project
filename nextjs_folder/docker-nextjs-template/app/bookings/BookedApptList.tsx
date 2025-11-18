"use client";
import { Booking } from "../lib/types/Booking";
import CancelBookingButton from "./CancelBookingButton";

export default function BookedApptsList({
  bookings,
  onCancel,
  onError,
}: {
  bookings: Booking[];
  onCancel: (apptId: Booking) => void;
  onError: (message: string) => void;
}) {
  if (!bookings.length) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-2">My Appointments</h2>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-lg font-semibold mb-2">My Appointments</h2>

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
            {bookings.map((row) => {
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
                    {/*formatter.format(new Date(row.starttime))*/}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    {new Date(row.endtime!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-2">{row.service}</td>
                  <td className="px-3 py-2">{row.providername}</td>

                  {/* <td className="px-3 py-2">
                    <CancelBookingButton
                      booking={row}
                      onSuccess={() => onCancel(row)}
                      onError={onError}
                    />
                  </td> */}

                  {row.bookstatus == "Booked" ? (
                    <td className="px-3 py-2">
                      <CancelBookingButton
                        booking={row}
                        onSuccess={() => onCancel(row)}
                        onError={onError}
                      />
                    </td>
                  ) : (
                    <td className="px-3 py-2">Cancelled</td>
                  )}

                  {/*!(row.bookstatus == "Cancelled") && (
                  <td className="px-3 py-2">
                    <CancelBookingButton 
                      bookingId={row.id!}
                      onSuccess={() => onCancel(row.id!)}/>
                  </td>
                  )*/}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
