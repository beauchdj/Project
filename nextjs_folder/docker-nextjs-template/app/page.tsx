"use server";

import Link from "next/link";
import { auth } from "@/auth";
import { RealTimeClock } from "./lib/components/RealTimeClock";

// type User = {
//   username: string;
//   password: string;
//   id: string;
// };

export default async function page() {
  const session = await auth();

  return (
    <main className="w-full flex items-center justify-center text-lg flex-col overflow-auto">
      <div className="flex flex-col items-center w-[95%] bg-black/70 rounded-xl py-4 h-[87vh] shadow-black shadow-xl mt-2">
        <div className="w-full flex flex-col items-center gap-3 h-[75vh] overflow-auto">
          <span className="flex-none text-4xl sm:text-5xl text-nowrap bg-clip-text text-transparent overflow-auto italic font-serif font-bold bg-gradient-to-r from-sky-200 to-sky-300">
            <RealTimeClock />
          </span>
          <span className="flex-1 flex justify-center items-center w-[80%]">
            <span className="text-center text-3xl italic font-serif bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-lime-200 sm:text-5xl indent-4 p-2">
              Welcome to Schwellness , your one-stop solution for hassle-free
              appointment booking. Whether you&apos;re looking for medical
              consultations, fitness sessions, or beauty treatments, our
              platform makes scheduling simple, fast, and convenient. Explore
              available services, select a time that fits your schedule, and
              confirm your appointment in just a few clicks. Enjoy a seamless
              booking experience designed to save you time and keep your day
              organized.
            </span>
          </span>
          <div>
            {!session && (
              <div className="sm:text-2xl text-nowrap bg-clip-text text-transparent overflow-auto italic font-serif font-bold bg-gradient-to-r from-sky-200 to-sky-300">
                <span>
                  Would you like to{" "}
                  <Link href="/login" className="visit-links">
                    Login
                  </Link>{" "}
                </span>
                <span>
                  or{" "}
                  <Link href="/register" className="visit-links">
                    Register
                  </Link>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
