"use client";

import { Session } from "next-auth";
import Link from "next/link";

// import { useState } from 'react';

export default function Dropdown({ session }: { session?: Session | null }) {
  // const [selected, setSelected] = useState('');
  let isSp = false;
  let isCust = false;
  if (session && session.user) {
    isSp = session.user.isSp!;
    isCust = session.user.isCustomer!;

    console.log("should set isSp: ", isSp, session.user);
  }
  return (
    <div className="group relative p-1 cursor-default">
      <div className="flex flex-col gap-0.5">
        <div className="hover-bar" />
        <div className="hover-bar" />
        <div className="hover-bar" />
        <div
          className={
            "group-hover:flex group-hover:absolute flex-col hidden top-0 left-[-1rem] z-10 bg-emerald-900 w-fit h-fit rounded-xl" // default behavior is hidden, when the group is hovered it will stay with group-hover:...
          }
        >
          <Link className="nav-btn" href={"/"}>
            Root
          </Link>
          <Link className="nav-btn" href={"/home"}>
            Home
          </Link>
          <Link className="nav-btn" href={"/login"}>
            Login
          </Link>
          <Link href={"/demo"} className={"nav-btn"}>
            Demo
          </Link>
          <Link href={"/register"} className={"nav-btn"}>
            Register
          </Link>
          {/* {isSp && ( */}
          <Link href={"/appointments"} className={"nav-btn text-xs"}>
            Edit Availability
          </Link>
          {/* )} */}
          {isCust && (
            <Link href={"/bookings"} className="nav-btn">
              Bookings
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
