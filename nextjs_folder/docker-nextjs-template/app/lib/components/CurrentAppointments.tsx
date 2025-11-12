/**
 * Need to run this query somewhere: gives appointments up to 1 day in advance
 * SELECT * FROM appt_bookings
 * JOIN appts_avail ON appts_avail.id = appt_bookings.apptid
 * WHERE userid = '82dabe93-46b5-4d2b-aafa-25343949d0fa'
 * AND starttime::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '2 days';
 */

import { useEffect, useState } from "react";
import { Notification } from "../types/Notification";

export function CurrentAppointments({ userid }: { userid: string }) {
  const [showList, setShowList] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  async function getAllAppts() {
    const resp = await fetch(`/api/notifications/${userid}`, { method: "GET" });
    const json = await resp.json();
    setNotifications(json);
  }
  useEffect(() => {
    getAllAppts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className={`relative h-8 w-8 ${
        !showList ? "text-black" : "text-white"
      } mr-2 group cursor-pointer`}
    >
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
        onClick={() => {
          setShowList((p) => !p);
        }}
      >
        <path d="M3 1H1V3H3V1Z" />
        <path d="M3 5H1V7H3V5Z" />
        <path d="M1 9H3V11H1V9Z" />
        <path d="M3 13H1V15H3V13Z" />
        <path d="M15 1H5V3H15V1Z" />
        <path d="M15 5H5V7H15V5Z" />
        <path d="M5 9H15V11H5V9Z" />
        <path d="M15 13H5V15H15V13Z" />
      </svg>
      {/* <div
        hidden={!!!notifications.length}
        className="w-[12px] h-[12px] rounded-4xl bg-red-500 bottom-0 right-0 absolute text-white text-[8px] flex justify-center items-center select-none"
      >
        {notifications.length}
      </div> */}
      <div
        className="bg-emerald-900 text-white absolute top-8 right-2 px-1 rounded border-black border-2 cursor-default w-85 h-fit max-h-55 text-xs whitespace-normal overflow-y-scroll z-99"
        hidden={showList}
      >
        <span className="sticky flex text-white border-b-[1px] border-black w-full font-bold">
          All Upcoming Appointments:
        </span>
        <div className="flex flex-col max-h-[165px] overflow-auto">
          {notifications.map((note, idx) => (
            <div
              key={idx}
              className="border-b-[1px] border-b-black/30 w-full flex flex-col text-emerald-300 py-2"
            >
              <span className="text-sky-400">
                <span className="text-white">Appointment with: </span>
                {note.providername}
              </span>
              <span className="text-amber-300">
                <span className="text-white">On: </span>
                {new Date(note.starttime).toLocaleString()}
              </span>
              <span className="text-amber-300">
                <span className="text-white">Until: </span>
                {new Date(note.endtime).toLocaleString()}
              </span>
              <span className="text-sky-400">
                <span className="text-white">For: </span> {note.service}
              </span>
              <span className="text-lime-400">
                <span className="text-white">Status: </span>{" "}
                {note.status || note.bookstatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
