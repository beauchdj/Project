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
