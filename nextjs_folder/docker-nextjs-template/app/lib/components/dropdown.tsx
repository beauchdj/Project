"use client";

import { Session } from "next-auth";
import Link from "next/link";

// import { useState } from 'react';

export default function Dropdown({ session }: { session?: Session | null }) {
  // const [selected, setSelected] = useState('');
  let isSp = false;
  let isCustomer = false;
  if (session && session.user) {
    isSp = session.user.isSp!;
    isCustomer = session.user.isCustomer!;
  }
  return (
    <div className="group relative p-1 cursor-default flex-none">
      <div className="flex flex-col gap-0.5">
        <div className="hover-bar" />
        <div className="hover-bar" />
        <div className="hover-bar" />
        <div
          className={
            "border-white border-2 shadow-black shadow-lg group-hover:flex group-hover:absolute p-4 flex-col hidden top-[1rem] left-[0.5rem] bg-emerald-700 w-fit h-fit rounded-xl z-40" // default behavior is hidden, when the group is hovered it will stay with group-hover:...
          }
        >
          <Link className="nav-btn" href={"/"}>
            Home
          </Link>
          {/* <Link className="nav-btn" href={"/home"}>
            Home
          </Link> */}
          <Link className="nav-btn" href={"/login"}>
            Login
          </Link>
          {/* Demo will become Admin panel */}
          {/* <Link href={"/demo"} className={"nav-btn"}>
            Demo
          </Link> */}
          <Link href={"/register"} className={"nav-btn"}>
            Register
          </Link>
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
    </div>
  );
}
