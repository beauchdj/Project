"use client";
import { MyChartData } from "@/app/api/admin/route";
import ChartWrapper from "./ChartWrapper";
import { useEffect } from "react";

/**
 *
 * @returns returns an abolsute position element with a list of ChartWrappers
 */
export default function MyCharts({
  showCharts,
  chartData,
}: {
  showCharts: boolean;
  chartData: MyChartData[];
}) {
  useEffect(() => {
    console.log("Bro what inside MyChart.tsx: ", chartData);
  }, [chartData]);
  return (
    <div
      className="bg-emerald-700 absolute h-[80vh] w-[90vw]"
      hidden={!showCharts}
    >
      {chartData.length && (
        <>
          {chartData &&
            chartData.map((p: MyChartData, index) => (
              <div key={index}>
                <ChartWrapper chartData={p} />
              </div>
            ))}
        </>
      )}
    </div>
  );
}
