/* Gavin Stankovsky, Jaclyn Brekke
*  December 2025 (Latest)
*  Navigation top bar component 
*/


"use client";
import { signOut, useSession } from "next-auth/react";
import Dropdown from "./Dropdown";
import { GlobalBell } from "./NotificationBell";
import { CurrentAppointments } from "./CurrentAppointments";
//import { GlobalBell2 } from "./NotificationBell2";

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
          " w-full flex flex-1 justify-center text-2xl sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-lime-400 italic select-none"
        }
      >
        Schwellness
      </h1>
      {session?.user.username && (
        <>
          <GlobalBell session={session} />
          {/* <GlobalBell2 /> */}
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
 * Need booking side notification insert to include the sp userid
 * Need appointment side notification insert to include cust id
 */
