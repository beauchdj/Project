"use client";

import { Appointment } from "@/app/lib/types/Appointment";
import { dateFormatter, dayFormatter } from "@/app/lib/types/Formatter";
import { useState } from "react";

export default function AdminView({ appt_list }: { appt_list: Appointment[] }) {
  const [appts, setAppts] = useState<Appointment[]>(appt_list);
  const [error, setError] = useState<string>("");
  /* Kind of ugly how this is going but it works... */
  const filterDate = async (startdate: number, enddate: number) => {
    if (startdate > enddate) {
      setAppts([]);
      setError("Start Date cannot be before End Date");
      return;
    }
    const updated = appt_list.filter((appt) => {
      const apptStart = new Date(appt.starttime);
      const startNum = new Date(
        apptStart.getFullYear(),
        apptStart.getMonth(),
        apptStart.getDate(),
        0,
        0
      ).getTime();
      const apptEnd = new Date(appt.endtime);
      const endNum = new Date(
        apptEnd.getFullYear(),
        apptEnd.getMonth(),
        apptEnd.getDate(),
        0,
        0
      ).getTime();
      if (startdate <= startNum && enddate >= endNum) return appt;
    });
    updated.sort(
      (a, b) =>
        new Date(a.starttime).getTime() - new Date(b.starttime).getTime()
    );
    setAppts(updated);
  };

  return (
    <main className="w-full flex flex-row items-start justify-center gap-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formdata = new FormData(e.currentTarget);
          const start = formdata.get("start") as string;
          const end = formdata.get("end") as string;

          if (start && end) {
            const starttime = new Date(start + "T00:00:00").getTime();
            const endtime = new Date(end + "T00:00:00").getTime();
            filterDate(starttime, endtime);
          } else if (start && !end) {
          } else setAppts(appt_list);
        }}
        className="justify-center items-center rounded-2xl text-black flex flex-col gap-1 ml-4"
      >
        <div className="bg-emerald-400 rounded-2xl p-2 flex md:items-center px-8 py-4 shadow-xl shadow-black flex-col gap-2 overflow-auto border-4 border-black">
          <div className="flex flex-col justify-center items-center gap-1">
            <label>Start Date:</label>
            <input
              type="date"
              name="start"
              className="border-lime-300 border-2 rounded w-fit"
              required
              // min={new Date().toISOString().slice(0, 10)}
              // max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))
              //   .toISOString()
              //   .slice(0, 10)}
            />
            <label>End Date:</label>
            <input
              type="date"
              name="end"
              className="border-lime-300 border-2 rounded w-fit"
              required
            />
          </div>
          <div className="flex gap-1 w-full justify-center items-center">
            <button type="submit" className="nav-btn">
              Submit
            </button>
            <button
              type="reset"
              className="nav-btn"
              onClick={() => {
                setAppts(appt_list);
                setError("");
              }}
            >
              Reset
            </button>
          </div>
          <section className="text-red-500">{error}</section>
        </div>
      </form>
      <div className="flex flex-col gap-1 w-[75vw] items-center overflow-y-auto h-[80vh] pb-1 bg-emerald-800/80 text-white rounded-2xl border-black border-4 mr-4">
        <table className="w-full border-collapse text-center">
          <thead className="bg-emerald-900 sticky top-0 text-emerald-400">
            <tr>
              <th>Name</th>
              <th className="p-3">Date</th>
              <th>Service</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {appts.length === 0 ? (
              <tr></tr>
            ) : (
              <>
                {appts.map((appt, idx) => (
                  <tr key={idx} className="border-white border-b-1 h-14">
                    <td>{appt.fullname}</td>
                    <td>{dateFormatter.format(new Date(appt.starttime))}</td>
                    <td>{appt.service ?? "None"}</td>
                    <td>{dayFormatter.format(new Date(appt.starttime))}</td>
                    <td>{dayFormatter.format(new Date(appt.endtime))}</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
