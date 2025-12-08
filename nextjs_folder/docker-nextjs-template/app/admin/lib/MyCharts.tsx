"use client";
import { MyChartData } from "@/app/api/admin/route";
import ChartWrapper from "./ChartWrapper";
import { Dispatch, SetStateAction } from "react";

/**
 *
 * @returns returns an abolsute position element with a list of ChartWrappers
 */
export default function MyCharts({
  start,
  end,
  showCharts,
  setShowCharts,
  chartData,
}: {
  start: string;
  end: string;
  showCharts: boolean;
  setShowCharts: Dispatch<SetStateAction<boolean>>;
  chartData: MyChartData[];
}) {
  return (
    <div
      className="bg-emerald-900 absolute h-full w-[95%] rounded border-2 border-black mx-4"
      hidden={!showCharts}
    >
      <h1 className="text-center w-full">
        {end.split(" ")[0] !== "Invalid" ? (
          <>
            Data Generated From {start} To {end}
          </>
        ) : (
          <>Data Generated From {start} Onward</>
        )}
      </h1>
      <div className="w-full h-full relative pt-8 grid grid-cols-2 justify-items-center p-2">
        {chartData &&
          chartData.map((p: MyChartData, index) => (
            <div key={index} className="z-0 w-fit">
              <ChartWrapper chartData={p} />
            </div>
          ))}
        <button
          onClick={() => setShowCharts(false)}
          className="absolute text-white top-0 left-4 z-1 bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-300 cursor-pointer"
        >
          Back
        </button>
      </div>
    </div>
  );
}
