"use client";

import { Appointment } from "@/app/lib/types/Appointment";
import { dateFormatter, dayFormatter } from "@/app/lib/types/Formatter";
import { useState } from "react";

export default function AdminView({ appt_list }: { appt_list: Appointment[] }) {
  const [appts, setAppts] = useState<Appointment[]>(appt_list);
  const filterDate = async (startdate: number, enddate: number) => {
    const updated = appt_list.filter((v) => {
      const vStart = new Date(v.starttime).getTime();
      const vEnd = new Date(v.endtime).getTime();
      if (startdate <= vStart && enddate >= vEnd) return v;
    });
    setAppts(updated);
  };
  return (
    <main className="w-full flex flex-col items-center gap-1">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formdata = new FormData(e.currentTarget);
          const start = formdata.get("start") as string;
          const end = formdata.get("end") as string;

          if (start && end) {
            const starttime = new Date(start).getTime();
            const endtime = new Date(end).getTime();
            filterDate(starttime, endtime);
          } else setAppts(appt_list);
        }}
        className="w-[80%] rounded-2xl text-black px-4 py-4 flex flex-col gap-1 md:justify-center overflow-auto"
      >
        <label className="bg-emerald-400 rounded-2xl p-2 flex items-center">
          Start:
          <input
            type="date"
            name="start"
            className="border-lime-300 border-2 rounded"
            // min={new Date().toISOString().slice(0, 10)}
            // max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            //   .toISOString()
            //   .slice(0, 10)}
          />
        </label>
        <label className="flex bg-emerald-400 rounded-2xl p-2 items-center">
          End:
          <input
            type="date"
            name="end"
            className="border-lime-300 border-2 rounded"
          />
        </label>
        <button type="submit" className="nav-btn">
          Submit
        </button>
        <button type="reset" className="nav-btn">
          Reset
        </button>
      </form>
      <div className="flex flex-col gap-1 w-[90%] items-center overflow-y-auto h-[70vh] bg-emerald-800/80 text-white rounded-2xl">
        <table className="w-full border-collapse text-center">
          <thead className="bg-gray-500 sticky top-0">
            <tr>
              <th className="p-3">Date</th>
              <th>Service</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {appts.map((appt, idx) => (
              <tr key={appt.id ?? idx} className="">
                <td>{dateFormatter.format(new Date(appt.starttime))}</td>
                <td>{appt.service ?? "None"}</td>
                <td>{dayFormatter.format(new Date(appt.starttime))}</td>
                <td>{dayFormatter.format(new Date(appt.endtime))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
