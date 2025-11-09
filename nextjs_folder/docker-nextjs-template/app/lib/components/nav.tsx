"use client";
import { signOut, useSession } from "next-auth/react";
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { Notification } from "../types/Notification";
// import { Session } from "next-auth";

export default function Nav() {
  const { data: session, status } = useSession();

  const signOutHandler = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") return <Loading />;

  return (
    <main
      className="
      flex flex-row h-20 
      items-center
      justify-center
      bg-emerald-800/80
      px-6
      m-2
      rounded-2xl
      shadow-black
      shadow
      z-0
      border-black border-2
      "
    >
      <Dropdown session={session} />
      <h1
        className={
          "flex-1 w-full flex justify-center text-2xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-lime-400 italic select-none"
        }
      >
        Schwellness
      </h1>
      {session?.user.username && (
        <>
          <GlobalBell session={session} />
          <CurrentAppointments userid={session.user.id} />
          <button
            onClick={signOutHandler}
            className="nav-btn cursor-pointer text-sm"
          >
            Sign Out
          </button>
        </>
      )}
    </main>
  );
}

function Loading() {
  return (
    <main
      className="
      flex flex-row h-20 
      items-center justify-between
      bg-emerald-700
      text-end
      px-4
      m-2
      rounded-2xl
      shadow-black
      shadow
      w-full
    "
    >
      Loading...
    </main>
  );
}
/**
 * Left working with notification bell
 * Need to think about adding to nofication table
 * Need to think about if we need a cron job - idk how not thinking abt it
 * RN: Try using just the booking table and filter for appointments a few days in advance
 */

function GlobalBell({ session }: { session: Session | null }) {
  /** Need to get data from db, should be a check of all users appts @ time of login/refresh...maybe not login */
  const [showList, setShowList] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchDayOuts(session!.user.id);
  }, []);

  async function fetchDayOuts(uid: string) {
    const res = await fetch(`/api/notifications?uid=${uid}`, { method: "GET" });
    const json: Notification[] = await res.json();
    setNotifications(json);
  }

  function Bell() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        fill="currentColor"
        className="absolute"
      >
        <path d="M320 64C302.3 64 288 78.3 288 96L288 99.2C215 114 160 178.6 160 256L160 277.7C160 325.8 143.6 372.5 113.6 410.1L103.8 422.3C98.7 428.6 96 436.4 96 444.5C96 464.1 111.9 480 131.5 480L508.4 480C528 480 543.9 464.1 543.9 444.5C543.9 436.4 541.2 428.6 536.1 422.3L526.3 410.1C496.4 372.5 480 325.8 480 277.7L480 256C480 178.6 425 114 352 99.2L352 96C352 78.3 337.7 64 320 64zM258 528C265.1 555.6 290.2 576 320 576C349.8 576 374.9 555.6 382 528L258 528z" />
      </svg>
    );
  }

  return (
    <div
      className={`w-8 h-8 m-2 ${
        !showList ? "text-black" : "text-white"
      } active:text-black cursor-pointer relative`}
      onClick={() => {
        setShowList((p) => !p);
      }}
    >
      <Bell />
      <div
        hidden={!!!notifications.length}
        className="w-[12px] h-[12px] rounded-4xl bg-red-500 bottom-1 right-1 absolute text-white text-[8px] flex justify-center items-center select-none"
      >
        {notifications.length}
      </div>
      <div
        className="bg-emerald-900 text-white absolute top-8 right-2 px-1 rounded border-black border-2 cursor-default w-85 h-fit max-h-55 text-xs whitespace-normal overflow-y-scroll z-99"
        hidden={showList}
      >
        {notifications.map((note, idx) => (
          <div
            key={idx}
            className="border-b-[1px] border-b-black/30 w-full flex flex-col text-emerald-300"
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
            <span className="text-lime-300">
              <span className="text-white">Status: </span> {note.bookstatus}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Need to run this query somewhere: gives appointments up to 1 day in advance
 * SELECT * FROM appt_bookings
 * JOIN appts_avail ON appts_avail.id = appt_bookings.apptid
 * WHERE userid = '82dabe93-46b5-4d2b-aafa-25343949d0fa'
 * AND starttime::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '2 days';
 */

function CurrentAppointments({ userid }: { userid: string }) {
  const [showList, setShowList] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  async function getAllAppts() {
    const resp = await fetch(`/api/notifications/${userid}`, { method: "GET" });
    const json = await resp.json();
    setNotifications(json);
  }
  useEffect(() => {
    getAllAppts();
  }, []);
  return (
    <div
      className={`relative h-8 w-8 ${
        showList ? "text-black" : "text-white"
      } mr-2 group cursor-pointer`}
      onClick={() => {
        setShowList((p) => !p);
      }}
    >
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
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
        hidden={!showList}
      >
        <span className="sticky text-white border-b-[2px] border-r-[2px] border-black">
          All Upcoming Appointments:
        </span>
        <div className="flex flex-col max-h-[165px] overflow-auto">
          {notifications.map((note, idx) => (
            <div
              key={idx}
              className="border-b-[1px] border-b-black/30 w-full flex flex-col text-emerald-300"
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
                <span className="text-white">Status: </span> {note.bookstatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
