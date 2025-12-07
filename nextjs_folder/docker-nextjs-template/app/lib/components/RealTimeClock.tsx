/* Gavin Stankovsky
*  November 2025
*  Main page clock 
*/

"use client";

import { useEffect, useState } from "react";
import { formatter } from "../types/Formatter";

export function RealTimeClock() {
  const [time, setTime] = useState<string>();
  useEffect(updateClock, []);
  function updateClock() {
    let date = new Date();
    setInterval(() => {
      date = new Date();
      setTime(formatter.format(date));
    }, 1000 - (date.getTime() % 1000)); // subtract the systemtime
  }
  return (
    <div className="w-full h-full text-white p-4 rounded italic ">{time}</div>
  );
}
