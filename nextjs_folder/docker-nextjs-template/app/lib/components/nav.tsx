"use client";
import { signOut, useSession } from "next-auth/react";
import Dropdown from "./dropdown";
import { Session } from "next-auth";

export default function Nav() {
  const { data: session, status } = useSession();

  const signOutHandler = async () => {
    await signOut({ callbackUrl: "/" });
  };

  console.log(session);

  return (
    <main
      className="
      flex flex-row h-20 
      items-center justify-between
      bg-emerald-700
      mb-2
      px-4
      mx-2
      rounded-2xl
    "
    >
      <Dropdown session={session} />
      <div>Status: {status}</div>
      {session && <Roles session={session} />}
      {session?.user.username && (
        <button onClick={signOutHandler} className="nav-btn cursor-pointer">
          SignOut
        </button>
      )}
    </main>
  );
}

function Roles({ session }: { session: Session }) {
  return (
    <div className="flex flex-col text-[8px]">
      <div>Admin: {session?.user.isAdmin ? "true" : "false"}</div>
      <div>Customer {session?.user.isCustomer ? "true" : "false"}</div>
      <div>
        ServiceProvider:
        {session?.user.isSp ? "true" : "false"}
      </div>
    </div>
  );
}
