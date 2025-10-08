"use client";
import { Booking } from "../lib/types/Booking";
import { formatter } from "../lib/types/Formatter";
import BookApptButton from "./BookApptButton";

type Props = {
  data: Booking[] | null;
};

export default function AvailableApptsList({ data }: Props) {
  if (!data) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-2">All Appointments</h2>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-lg font-semibold mb-2">All Appointments</h2>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-900/10">
            <tr>
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
                  <td className="px-3 py-2 whitespace-nowrap">
                    {formatter.format(new Date(row.starttime))}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {formatter.format(new Date(row.endtime))}
                  </td>
                  <td className="px-3 py-2">{row.service}</td>
                  <td className="px-3 py-2">{row.providername}</td>
                  <td className="px-3 py-2">
                    <BookApptButton apptId={row.id} />
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

// <pre> {JSON.stringify(data)}</pre>
