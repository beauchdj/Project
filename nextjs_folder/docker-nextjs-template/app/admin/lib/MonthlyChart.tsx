/**
 * Gavin Stankovsky
 * December 2025
 * This is a React component file
 *
 * This is an un-used file that was a unique chart wrapper for monthly data
 * didnt get around to implementing its use case ( a bit too abitious )
 */
"use client";
import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { MyChartData } from "@/app/api/admin/route";
/**
 * chartData{ ...chartData, data: is actually a datasets object}
 */

export default function MonthlyChart({
  chartData,
}: {
  chartData: MyChartData;
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    if (!ctx) return;
    const chart = new Chart(ctx, {
      type: `${chartData.type}`,
      data: {
        labels: chartData.labels,
        datasets: [
          {
            maxBarThickness: 50,
            label: chartData.label,
            data: chartData.data,
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: chartData.bgColors,
          },
        ],
      },
      options: {
        scales: {
          x: {
            grid: { color: "#000000" },
            ticks: { color: "#ffffff" },
            title: { display: true, text: chartData.xAxis, color: "#ffffff" },
          },
          y: {
            grid: { color: "#000000" },
            ticks: { color: "#ffffff" },
            title: { display: true, text: chartData.yAxis, color: "#ffffff" },
          },
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              color: "#ffffff",
            },
          },
          title: {
            display: true,
            text: chartData.title,
            color: "#ffffff",
          },
        },
      },
    });

    return () => chart.destroy(); // cleanup on unmount
  }, [chartData]);

  return (
    <div className="w-fit h-fit">
      <canvas ref={canvasRef} />
    </div>
  );
}
