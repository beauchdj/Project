import { countSpAndCust } from "@/app/lib/services/chartServices";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export type MyChartData = {
  type: "bar" | "line" | "pie";
  data: number[];
  labels: string[];
  bgColors: string[];
  label: string;
  xAxis: string;
  yAxis: string;
};

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user.isAdmin)
    return new NextResponse("Unauthorized", { status: 401 });

  const url = new URL(req.url);
  const params = url.searchParams;
  const start = params.get("start");
  const end = params.get("end");
  const starttime: number = new Date(start + "T00:00:00").getTime();
  const endtime: number = new Date(end + "T00:00:00").getTime();
  console.log("Start time: ", starttime, endtime);

  console.log(start, end);
  const res: number[] | null = await countSpAndCust(starttime, endtime);
  const countChart: MyChartData[] = [
    {
      type: "bar",
      data: res ?? [0, 0],
      bgColors: ["#ffffff", "#000000"],
      label: "Users",
      labels: ["Service Providers", "Customers"],
      xAxis: "Users",
      yAxis: "Registered Users",
    },
  ];

  if (!res) return NextResponse.json("Invalid response", { status: 400 });

  return NextResponse.json(countChart, { status: 200 });
}

//
