"use client";
import { MyChartData } from "@/app/api/admin/route";
import { Dispatch, FormEvent, SetStateAction } from "react";

export default function DataForm({
  setChartData,
  setShowCharts,
}: {
  setChartData: Dispatch<SetStateAction<MyChartData[]>>;
  setShowCharts: Dispatch<SetStateAction<boolean>>;
}) {
  async function submitData(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formdata = new FormData(e.currentTarget);
      const start = formdata.get("start") as string;
      const end = formdata.get("end") as string;
      const queryParams = end ? `start=${start}&end=${end}` : `start=${start}`;
      const res = await fetch(`/api/admin?${queryParams}`);
      const data = await res.json();
      console.log("Ran the function: ", data);

      if (res.ok) {
        setChartData(data);
      } else {
        console.log("Fetch failed for dataform");
      }
      setShowCharts(true);
    } catch (error) {
      console.log("we got an error: ", error);
      if (error instanceof Error) {
        console.log("Error in submitDates for DataForm: ", error);
      }
    }
  }
  return (
    <form
      onSubmit={submitData}
      className="justify-center items-center rounded-2xl text-black flex flex-col gap-1"
    >
      <div
        className={
          "bg-emerald-800 rounded-2xl p-2 flex md:items-center px-2 py-2 md:px-8 md:py-4 flex-col gap-2 overflow-auto border-2 border-black"
        }
      >
        <div className="flex flex-col justify-center items-center text-white">
          <h3 className="underline underline-offset-4">Generate Data</h3>
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
        <div className="flex gap-1 w-full justify-center items-center flex-col md:flex-row">
          <button type="submit" className="nav-btn">
            Show Data
          </button>
        </div>
      </div>
    </form>
  );
}
