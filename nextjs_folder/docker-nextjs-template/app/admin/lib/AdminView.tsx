"use client";

import { Appointment } from "@/app/lib/types/Appointment";
import { dateFormatter, dayFormatter } from "@/app/lib/types/Formatter";
import { FormEvent, useState } from "react";
import { filterDate } from "./util";
import { useNotification } from "@/app/lib/components/NotificationContext";
import Link from "next/link";
import DataForm from "./DataForm";
import MyCharts from "./MyCharts";
import { MyChartData } from "@/app/api/admin/route";
import { User } from "@/app/lib/types/User";

export default function AdminView({
  appt_list,
  user_list,
}: {
  appt_list: Appointment[];
  user_list: User[];
}) {
  const [appts, setAppts] = useState<Appointment[]>(appt_list);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [users, setUsers] = useState<User[]>(user_list);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string>("");
  const [showCharts, setShowCharts] = useState<boolean>(false);
  const [chartData, setChartData] = useState<MyChartData[]>([]);
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
    <main className="w-full flex flex-row items-start justify-center gap-2 relative">
      <div className="ml-4 flex flex-col gap-1">
        <form
          onSubmit={submitDates}
          className="justify-center items-center rounded-2xl text-black flex flex-col gap-1"
        >
          <div
            className={
              "bg-emerald-800 rounded-2xl p-2 flex md:items-center px-2 py-2 md:px-8 md:py-4 flex-col gap-2 overflow-auto border-2 border-black"
            }
          >
            <div className="flex flex-col justify-center items-center text-white">
              <h3 className="underline underline-offset-4 text-xs">
                Search Appointments
              </h3>
              <label>Start Date:</label>
              <input
                type="date"
                name="start"
                className="border-lime-200 border-2 rounded w-fit"
                required
              />
              <label>End Date:</label>
              <input
                type="date"
                name="end"
                className="border-lime-200 border-2 rounded w-fit"
              />
            </div>
            <div className="flex gap-1 w-full justify-center items-center flex-col">
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
          </div>
        </form>
        <DataForm
          setStart={setStart}
          setEnd={setEnd}
          setShowCharts={setShowCharts}
          setChartData={setChartData}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 w-[75vw] md:items-center overflow-auto h-[40vh] pb-1 bg-emerald-800/90 text-white rounded-2xl border-black border- mr-4">
          <table className="w-full border-collapse text-center">
            <thead className="bg-emerald-900 sticky top-0 text-white text-xs">
              <tr>
                <th className="p-3">Index</th>
                <th>Service Provider</th>
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
                      className="border-white/10 border-b-[1px] h-14 text-white text-sm hover:bg-emerald-200/20"
                    >
                      <td>{idx + 1}</td>
                      <td>
                        <Link
                          className={"hover:text-black"}
                          href={`/admin/${appt.sp_id}`}
                        >
                          {appt.sp_providername}
                        </Link>
                      </td>
                      <td>
                        {appt.cust_id === null ? (
                          "--"
                        ) : (
                          <Link
                            className={"hover:text-black"}
                            href={`/admin/${appt.cust_id}`}
                          >
                            {appt.cust_fullname}
                          </Link>
                        )}
                      </td>
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

        <div className="flex flex-col gap-1 w-[75vw] md:items-center overflow-auto h-[40vh] pb-1 bg-emerald-800/90 text-white rounded-2xl border-black border- mr-4">
          <table className="w-full border-collapse text-center">
            <thead className="bg-emerald-900 sticky top-0 text-white text-xs">
              <tr>
                <th className="p-3">Name</th>
                <th>Service Category</th>
                <th>City</th>
                <th>State</th>
                <th>Created At</th>
                <th>IsActive</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>None</tr>
              ) : (
                <>
                  {users.map((user, idx) => (
                    <tr
                      key={idx}
                      className="border-white/10 border-b-[1px] h-14 text-white text-sm hover:bg-emerald-200/20"
                    >
                      <td>
                        <Link
                          className={"hover:text-black"}
                          href={`/admin/${user.id}`}
                        >
                          {user.providername ? (
                            <>{user.providername}</>
                          ) : (
                            <>{user.fullname}</>
                          )}
                        </Link>
                      </td>
                      <td>{user.servicecategory ?? "Customer"}</td>
                      <td>{user.city}</td>
                      <td>{user.state}</td>
                      <td>{new Date(user.created_at!).toLocaleDateString()}</td>
                      <td>{user.isactive ? "True" : "False"}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MyCharts
        start={new Date(start).toLocaleDateString()}
        end={new Date(end).toLocaleDateString()}
        setShowCharts={setShowCharts}
        showCharts={showCharts}
        chartData={chartData}
      />
    </main>
  );
}
