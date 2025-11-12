"use client";

import { Appointment } from "@/app/lib/types/Appointment";
import { dateFormatter, dayFormatter } from "@/app/lib/types/Formatter";
import { FormEvent, useState } from "react";
import { filterDate } from "./util";
import { useNotification } from "@/app/lib/components/NotificationContext";

export default function AdminView({ appt_list }: { appt_list: Appointment[] }) {
  const [appts, setAppts] = useState<Appointment[]>(appt_list);
  const [error, setError] = useState<string>("");

  const { toggleHidden } = useNotification();

  function submitDates(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const start = formdata.get("start") as string;
    const end = formdata.get("end") as string;

    try {
      if (start && end) {
        const starttime = new Date(start + "T00:00:00").getTime();
        const endtime = new Date(end + "T00:00:00").getTime();
        filterDate(starttime, endtime, setAppts, setError, appt_list);
        toggleHidden("Results Filtered!");
      } else if (start && !end) {
        const starttime = new Date(start + "T00:00:00").getTime();
        filterDate(starttime, 0, setAppts, setError, appt_list);
        toggleHidden("Results Filtered");
      } else setAppts(appt_list);
    } catch (error) {
      if (error instanceof Error) {
        toggleHidden("Error: Unsatisfactory Date's Provided");
      }
    }
  }

  return (
    <main className="w-full flex flex-row items-start justify-center gap-2">
      <form
        onSubmit={submitDates}
        className="justify-center items-center rounded-2xl text-black flex flex-col gap-1 ml-4"
      >
        <div className="bg-emerald-800/80 rounded-2xl p-2 flex md:items-center px-2 py-2 md:px-8 md:py-4 shadow-xl shadow-black flex-col gap-2 overflow-auto border-4 border-black">
          <div className="flex flex-col justify-center items-center text-white">
            <label>Start Date:</label>
            <input
              type="date"
              name="start"
              className="border-lime-200 border-2 rounded w-fit"
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
              className="border-lime-200 border-2 rounded w-fit"
            />
          </div>
          <div className="flex gap-1 w-full justify-center items-center flex-col md:flex-row">
            <button type="submit" className="nav-btn">
              Submit
            </button>
            <button
              type="reset"
              className="nav-btn"
              onClick={() => {
                toggleHidden("Result's Reset");
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
      <div className="flex flex-col gap-1 w-[75vw] md:items-center overflow-auto h-[80vh] pb-1 bg-emerald-800/80 text-white rounded-2xl border-black border-4 mr-4">
        <table className="w-full border-collapse text-center">
          <thead className="bg-emerald-900 sticky top-0 text-emerald-400">
            <tr>
              <th className="p-3">Service Provider</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Category</th>
              <th>Date</th>
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
                  <tr
                    key={idx}
                    className="border-white/10 border-b-[1px] h-14 text-sm md:text-base hover:bg-emerald-200/20"
                  >
                    <td>{appt.sp_providername}</td>
                    <td>{appt.cust_fullname}</td>
                    <td>{appt.service ?? "None"}</td>
                    <td>{appt.sp_servicecat}</td>
                    <td>{dateFormatter.format(new Date(appt.starttime))}</td>
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
