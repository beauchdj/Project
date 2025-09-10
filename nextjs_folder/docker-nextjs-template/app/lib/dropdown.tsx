'use client';

import Link from "next/link";

// import { useState } from 'react';

export default function Dropdown() {
  // const [selected, setSelected] = useState('');
  // const ev = () => {
  //   alert("Sugma");
  // }

  return (
    <main className="drop-down">
      <div className="group w-8 h-8 relative cursor-default">
        <div className="text-black bg-amber-400 group-hover:bg-slate-400 h-8 w-8 items-center justify-center flex rounded-2xl"></div>
        <div className={"group-hover:flex group-hover:absolute flex-col hidden top-1 left-0 z-10 bg-slate-600"}>
    
        <Link className="nav-btn" href={"/login"}>Login</Link>
        <Link className="nav-btn" href={"/"}>Home</Link>

        </div>

      </div>

    </main>

  );
}
