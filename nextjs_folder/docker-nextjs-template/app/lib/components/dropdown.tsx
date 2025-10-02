"use client";

import Link from "next/link";

// import { useState } from 'react';

export default function Dropdown() {
  // const [selected, setSelected] = useState('');

  return (
    <main className="">
      <div className="group relative p-1 cursor-default">
        <div className="flex flex-col gap-0.5">
          <div className="hover-bar" />
          <div className="hover-bar" />
          <div className="hover-bar" />
          <div
            className={
              "group-hover:flex group-hover:absolute flex-col hidden top-0 left-[-2em] z-10 bg-emerald-900 w-fit h-fit rounded-xl" // default behavior is hidden, when the group is hovered it will stay with group-hover:...
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
          </div>
        </div>
      </div>
    </main>
  );
}
