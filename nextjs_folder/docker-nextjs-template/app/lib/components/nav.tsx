"use client";
import { signOut, useSession } from "next-auth/react";
import Dropdown from "./Dropdown";
import { useState } from "react";
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
          "flex-1 w-full flex justify-center text-2xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-lime-400 italic"
        }
      >
        Schwellness
      </h1>
      {session?.user.username && (
        <>
          <GlobalBell />
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

function GlobalBell() {
  const [showList, setShowList] = useState<boolean>(false);
  const fakeList = [
    { message: "Upcomming Appointment", who: "Stelton Blue" },
    { message: "Upcoming Appointment", who: "Stelton Red" },
  ];
  const [notifications, setNotifications] = useState(fakeList);
  return (
    <div
      className="w-8 h-8 m-2 text-white active:text-black cursor-pointer relative"
      onClick={() => setShowList((p) => !p)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        fill="currentColor"
        className="absolute"
      >
        <path d="M320 64C302.3 64 288 78.3 288 96L288 99.2C215 114 160 178.6 160 256L160 277.7C160 325.8 143.6 372.5 113.6 410.1L103.8 422.3C98.7 428.6 96 436.4 96 444.5C96 464.1 111.9 480 131.5 480L508.4 480C528 480 543.9 464.1 543.9 444.5C543.9 436.4 541.2 428.6 536.1 422.3L526.3 410.1C496.4 372.5 480 325.8 480 277.7L480 256C480 178.6 425 114 352 99.2L352 96C352 78.3 337.7 64 320 64zM258 528C265.1 555.6 290.2 576 320 576C349.8 576 374.9 555.6 382 528L258 528z" />
      </svg>
      <div
        className="w-[12px] h-[12px] rounded-4xl bg-red-500 bottom-1 right-1 absolute text-white text-[8px] flex justify-center items-center indent-0.5"
        hidden={false}
      >
        {notifications.length}
      </div>
      <div
        className="bg-emerald-900 text-white absolute top-8 right-2 p-4 rounded-xl cursor-default"
        hidden={showList}
      >
        {notifications.map((note, idx) => (
          <div key={idx} className="w-64 overflow-scroll">
            {note.message} with: {note.who}
          </div>
        ))}
      </div>
    </div>
  );
}
