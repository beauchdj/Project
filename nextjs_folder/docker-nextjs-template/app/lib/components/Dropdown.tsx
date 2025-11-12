"use client";

import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// import { useState } from 'react';
export default function Dropdown({ session }: { session?: Session | null }) {
  let isSp = false;
  let isCustomer = false;
  let isAdmin = false;
  let isLoggedIn = false;

  if (session && session.user) {
    isSp = session.user.isSp!;
    isCustomer = session.user.isCustomer!;
    isAdmin = session.user.isAdmin!;
    isLoggedIn = true;
  }
  const pathname = usePathname();

  useEffect(() => {}, [pathname]);

  return (
    <div className="group relative p-1 cursor-default flex-none">
      <BarStack />
      <div
        // default behavior is hidden, when the group is hovered it will stay with group-hover:...
        className={
          "gap-2 border-black border-2 shadow-black shadow-lg group-hover:flex group-hover:absolute px-8 py-4 flex-col hidden top-[34px] left-[0.5rem] bg-emerald-700 w-fit h-fit rounded-xl z-40"
        }
      >
        {session?.user.username && (
          <span className="flex text-white items-center justify-center w-full text-center flex-col">
            Logged in as:
            <span>{session?.user.fullname}</span>
          </span>
        )}

        {isAdmin && (
          <Link href={"/admin"} className={"nav-btn"}>
            Admin
          </Link>
        )}
        <Link className="nav-btn" href={"/"}>
          Home
        </Link>
        {/* <Link className="nav-btn" href={"/home"}>
            Home
          </Link> */}
        {!isLoggedIn && (
          <>
            <Link className="nav-btn" href={"/login"}>
              Login
            </Link>
            <Link href={"/register"} className={"nav-btn"}>
              Register
            </Link>
          </>
        )}
        {isSp && (
          <Link href={"/appointments"} className={"nav-btn text-sm"}>
            Create Appointment
          </Link>
        )}
        {isCustomer && (
          <Link href={"/bookings"} className={"nav-btn text-sm"}>
            Book Appointment
          </Link>
        )}
      </div>
    </div>
  );
}

function BarStack() {
  return (
    <div className="flex flex-col gap-0.5 p-1">
      <div className="hover-bar" />
      <div className="hover-bar" />
      <div className="hover-bar" />
    </div>
  );
}
