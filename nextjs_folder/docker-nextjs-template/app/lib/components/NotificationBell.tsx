/* Gavin Stankovsky
*  November 2025
*  Notification Bell Component 
*/

"use client";

import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { Notification } from "../types/Notification";

/**
 * Left working with notification bell
 * Need to think about adding to nofication table
 * Need to think about if we need a cron job - idk how not thinking abt it
 * RN: Try using just the booking table and filter for appointments a few days in advance
 */

export function GlobalBell({ session }: { session: Session | null }) {
  /** Need to get data from db, should be a check of all users appts @ time of login/refresh...maybe not login */
  const [showList, setShowList] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications(session!.user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchNotifications(uid: string) {
    const res = await fetch(`/api/notifications?uid=${uid}`, { method: "GET" });
    const json: Notification[] = await res.json();
    setNotifications(json);
  }

  async function deleteNotification(note: Notification) {
    await fetch(`/api/notifications`, {
      method: "DELETE",
      headers: { "Content-Type": "application.json" },
      body: JSON.stringify({ noteid: note.noteid }),
    });
    // const json = await res.json();
    const updated = notifications.filter(
      (curnote) => curnote.noteid !== note.noteid
    );
    setNotifications(updated);
  }

  function Bell() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        fill="currentColor"
        className="absolute"
        onClick={() => {
          setShowList((p) => !p);
        }}
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
    >
      <Bell />
      {notifications.length > 0 ? (
        <>
          <div
            hidden={!!!notifications.length}
            className="w-[15px] h-[15px] rounded-3xl bg-red-500 bottom-1 right-1 absolute text-white text-[11px] flex justify-center items-center select-none"
            onClick={() => {
              setShowList((p) => !p);
            }}
          >
            {notifications.length}
          </div>
          <div
            className="bg-emerald-900 text-white absolute top-8 right-2 px-1 rounded border-black border-2 cursor-default w-85 h-fit max-h-55 text-xs whitespace-normal overflow-y-scroll z-99"
            hidden={showList}
          >
            <span className="font-bold flex w-full border-b-1 border-black">
              Notifications:{" "}
            </span>
            {notifications.map((note, idx) => (
              <div
                key={idx}
                className="border-b-[1px] border-b-black/30 w-full flex text-emerald-300 py-2"
              >
                <div className="flex flex-col w-full">
                  <span className="text-sky-400">
                    <span className="text-white">Appointment with: </span>
                    {note.providername}
                  </span>
                  <span className="text-sky-400">
                    <span className="text-white">For: </span> {note.service}
                  </span>
                  <span className="text-amber-300">
                    <span className="text-white">On: </span>
                    {new Date(note.starttime).toLocaleString()}
                  </span>
                  <span className="text-amber-300">
                    <span className="text-white">Until: </span>
                    {new Date(note.endtime).toLocaleString()}
                  </span>
                  <span
                    className={
                      note.status === "Cancelled"
                        ? "text-red-500 font-bold"
                        : "text-lime-300 font-bold"
                    }
                  >
                    <span className={"text-white font-normal"}>Status: </span>{" "}
                    {note.status || note.bookstatus}
                  </span>
                </div>
                <span className="flex justify-end pr-3 w-fit items-center">
                  <button
                    onClick={() => deleteNotification(note)}
                    className="bg-emerald-700 text-white rounded-xl hover:bg-emerald-600 w-fit h-fit px-4 py-1 cursor-pointer"
                  >
                    Clear
                  </button>
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div
          hidden={showList}
          className="bg-emerald-900 text-white absolute top-8 right-2 px-1 rounded border-black border-2 cursor-default w-85 h-fit max-h-55 text-xs whitespace-normal overflow-y-scroll z-99"
        >
          No notifications
        </div>
      )}
    </div>
  );
}
