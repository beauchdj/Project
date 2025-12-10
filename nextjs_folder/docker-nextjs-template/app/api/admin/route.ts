/**
 * Gavin Stankovsky
 * December 2025
 * This is an API route file for the MyChart.tsx Component
 *
 * This api route file supplies a single GET request for chart data
 */
import {
  countApptsBooked,
  countApptsCreated,
  countCancelledBookings,
  countSpAndCust,
  countSpCategories,
} from "@/app/lib/services/chartServices";
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
  title: string;
};

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user.isAdmin)
      return new NextResponse("Unauthorized", { status: 401 });
    // pull query params
    const url = new URL(req.url);
    const params = url.searchParams;
    const start = params.get("start");
    const end = params.get("end");
    const starttime: number = new Date(start + "T00:00:00").getTime() / 1000;
    const endtime: number = new Date(end + "T00:00:00").getTime() / 1000;
    // collect data
    const spCustCounts: number[] | null = await countSpAndCust(
      starttime,
      endtime
    );

    const apptsCreated = await countApptsCreated(starttime, endtime);
    const apptsBooked = await countApptsBooked(starttime, endtime);
    const apptsCancelled = await countCancelledBookings(starttime, endtime);
    const spCategories = await countSpCategories(starttime, endtime);

    // check data responses
    if (!spCustCounts)
      return NextResponse.json("Invalid response", { status: 400 });
    // create array of chart data
    const countChart: MyChartData[] = [
      {
        type: "bar",
        data: spCustCounts ?? [0, 0],
        bgColors: ["#ffffff", "#000000"],
        label: "Users",
        labels: ["Service Providers", "Customers"],
        xAxis: "Users",
        yAxis: "Registered Users",
        title: "Number Of Registered Users",
      },
      {
        type: "bar",
        data: apptsCreated ?? [0],
        bgColors: ["#FFFC61"],
        label: "Appointments",
        labels: ["Appointments"],
        xAxis: "",
        yAxis: "Created Appointments",
        title: "Number Of Created Appointments",
      },
      {
        type: "bar",
        data: apptsBooked ?? [0],
        bgColors: ["#61FF68"],
        label: "Booked Appointments",
        labels: ["Booked Appointments"],
        xAxis: "",
        yAxis: "Number of Bookings",
        title: "Number of Booked Appointments",
      },
      {
        type: "bar",
        data: apptsCancelled ?? [0],
        bgColors: ["#FF2121"],
        label: "Cancelled Bookings",
        labels: ["Cancelled Appointments"],
        xAxis: "",
        yAxis: "Number of Cancellations",
        title: "Number of Cancelled Appointments",
      },
      {
        type: "bar",
        data: spCategories ?? [0, 0, 0],
        bgColors: ["#ff9cf4"],
        label: "Service Providers",
        labels: ["Beauty", "Fitness", "Medical"],
        xAxis: "ServiceProvider Types",
        yAxis: "Number of ServiceProviders",
        title: "Service Provider Type Distribution",
      },
    ];
    // send chart data
    return NextResponse.json(countChart, { status: 200 });
  } catch (error) {
    console.log("Error in /api/admin GET ", error);
    return NextResponse.json("Server Error", { status: 500 });
  }
}

//
