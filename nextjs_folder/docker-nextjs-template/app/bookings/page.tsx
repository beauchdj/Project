"use server";
import { pool } from "@/lib/db";
import { auth } from "../../auth";
import { redirect } from "next/navigation";
// import { CalendarComponent } from "../lib/components/calendar";

type booking = {
  id: string;
  spid: string;
  starttime: Date;
  endtime: Date;
  service: string;
};

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");
  const bookings: booking[] = (await getBookings()) as booking[];

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const first = bookings?.at(0);
  const start = formatter.format(first?.starttime);
  const end = formatter.format(first?.endtime);
  return (
    <div>
      <h1>This is the Bookings Page for {session.user.fullname}</h1>
      <div className="flex bg-emerald-700 h-[40vh] flex-col">
        {bookings?.map((booking: booking) => (
          <div
            key={booking.id}
            className="grid grid-cols-3 text-xs w-full h-fit hover:border-white hover:border-1 m-1"
          >
            <div className="text-center">{booking.service}</div>
            <div className="text-center">{start}</div>
            <div className="text-center">{end}</div>
            {formatter.format(booking.starttime)}
          </div>
        ))}
      </div>
    </div>
  );
}

async function getBookings() {
  try {
    const res = await pool.query("SELECT * FROM appts_avail");

    console.log("Got bookings: ", res);
    return res.rows;
  } catch (error) {
    console.log("ERROR getBookings(): ", error);
    return null;
  }
}
