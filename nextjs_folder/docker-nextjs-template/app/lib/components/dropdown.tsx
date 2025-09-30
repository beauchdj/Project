"use client";

import Link from "next/link";

// import { useState } from 'react';

export default function Dropdown() {
  // const [selected, setSelected] = useState('');

  return (
    <main className="drop-down">
      <div className="group w-8 h-8 relative cursor-default">
        <div className="text-black bg-amber-400 group-hover:bg-slate-400 h-8 w-8 items-center justify-center flex rounded-2xl">
          <div
            className={
              "group-hover:flex group-hover:absolute flex-col hidden top-4 left-4 z-10 bg-slate-600 w-fit h-fit rounded" // default behavior is hidden, when the group is hovered it will stay with group-hover:...
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
