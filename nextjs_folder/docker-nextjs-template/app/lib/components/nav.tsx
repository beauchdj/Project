"use client";
import { signOut, useSession } from "next-auth/react";
import Dropdown from "./dropdown";

export default function Nav() {
  const { data: session, status } = useSession();

  const signOutHandler = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <main
      className="
      flex flex-row h-20 
      items-center justify-between
      bg-emerald-700
      rounded-3xl
      my-2
      mx-4
      px-8
    "
    >
      <Dropdown />
      <div>{session?.user.poop && <>hey {session.user.poop}</>}</div>
      <div>Status: {status}</div>
      {session?.user.poop && (
        <button onClick={signOutHandler} className="nav-btn">
          SignOut
        </button>
      )}
    </main>
  );
}
