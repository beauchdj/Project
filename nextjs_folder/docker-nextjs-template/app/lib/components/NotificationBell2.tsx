/* Jaclyn Brekke
*  December 2025
*  Notification Bell 2 component for troubleshooting alternative
*  notification handling. 
* 
* This version only displays notifications for cancelled appointments
* Mostly reused and modified Gavins NotificationBell code, but modified the fetches
*/
"use client";

import { useEffect, useState } from "react";

//Only notifications for cancelled appointments, not upcoming ones...
type Notification = {
  id: string;
  message: string;
  isactive: boolean;
  isnew: boolean;
};

export function GlobalBell2() {
  const [showList, setShowList] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchNotifications() {
    const res = await fetch(`/api/notifs`, { method: "GET" });
    const json = await res.json();
    console.log("NOTIFS FROM API:", json);
    setNotifications(json.notifications);
  }

  async function deleteNotification(notifId: string) {
    await fetch(`/api/notifs`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({notifId, isActive: false,isNew: false}),
    });

  setNotifications((prev) =>
    prev.filter((n) => n.id !== notifId));
  }

  return (
    <div className ="relative m-2">
    
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 640"
        fill="currentColor"
        className="w-8 h-8 cursor-pointer text-white"
        onClick={() => setShowList((p) => !p)}
      >
        <path d="M320 64C302.3 64 288 78.3 288 96L288 99.2C215 114 160 178.6 160 256L160 277.7C160 325.8 143.6 372.5 113.6 410.1L103.8 422.3C98.7 428.6 96 436.4 96 444.5C96 464.1 111.9 480 131.5 480L508.4 480C528 480 543.9 464.1 543.9 444.5C543.9 436.4 541.2 428.6 536.1 422.3L526.3 410.1C496.4 372.5 480 325.8 480 277.7L480 256C480 178.6 425 114 352 99.2L352 96C352 78.3 337.7 64 320 64zM258 528C265.1 555.6 290.2 576 320 576C349.8 576 374.9 555.6 382 528L258 528z" />
      </svg>

      {notifications.length > 0 && (
        <div
          className="w-[15px] h-[15px] rounded-full bg-red-500 bottom-1 right-1 absolute text-white text-[11px] flex justify-center items-center select-none"
          onClick={() => setShowList((p) => !p)}
        >
          {notifications.length}
        </div>
      )}

      {showList && (
        <div className="bg-emerald-900 text-white absolute top-8 right-2 px-2 rounded border-black border-2 w-85 max-h-55 text-xs overflow-y-scroll z-99">
          <span className="font-bold flex w-full border-b border-black mb-1">
            Notifications:
          </span>

          {notifications.length === 0 ? (
            <div className="p-2 text-center">No notifications</div>
          ) : (
            notifications.map((note) => (
              <div
                key={note.id}
                className="border-b border-black/30 w-full flex text-emerald-300 py-2 gap-2"
              >
                  <span className="text-sky-400">{note.message}</span>

                <button
                  onClick={() => deleteNotification(note.id)}
                  className="bg-emerald-700 text-white rounded-xl hover:bg-emerald-600 px-3 py-1 cursor-pointer h-fit"
                >
                  Clear
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
