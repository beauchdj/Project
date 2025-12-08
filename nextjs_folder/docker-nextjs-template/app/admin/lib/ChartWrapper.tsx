"use client";
import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { MyChartData } from "@/app/api/admin/route";

export default function ChartWrapper({
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
            label: chartData.label,
            data: chartData.data,
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: "#ffffff",
          },
        ],
      },
      options: {
        scales: {
          x: {
            grid: { color: "#000000" },
            ticks: { color: "#ffffff" },
            title: { display: true, text: chartData.xAxis, color: "#ffff00" },
          },
          y: {
            grid: { color: "#000000" },
            ticks: { color: "#ffffff" },
            title: { display: true, text: chartData.yAxis, color: "#ffff00" },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
            },
          },
        },
      },
    });

    return () => chart.destroy(); // cleanup on unmount
  }, [chartData]);

  return (
    <div className="bg-emerald-700 absolute h-[80vh] w-[90vw]">
      <canvas ref={canvasRef} className="bg-emerald-700" />
    </div>
  );
}
