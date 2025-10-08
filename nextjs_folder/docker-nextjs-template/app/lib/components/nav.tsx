"use client";
import { signOut, useSession } from "next-auth/react";
import Dropdown from "./dropdown";
// import { Session } from "next-auth";

export default function Nav() {
  const { data: session, status } = useSession();

  const signOutHandler = async () => {
    await signOut({ callbackUrl: "/" });
  };

  console.log(session);
  if (status === "loading") return <Loading />;

  return (
    <main
      className="
      flex flex-row h-20 
      items-center
      justify-center
      bg-emerald-800/80
      px-2
      m-2
      rounded-2xl
      shadow-black
      shadow
      z-0
      border-black border-2
    "
    >
      <Dropdown session={session} />
      <h1 className="flex-1 w-full flex justify-center text-6xl bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-lime-400 italic font-serif ">
        Schwellness
      </h1>
      {/* <div>Status: {status}</div> */}
      {/* {session && <Roles session={session} />} */}
      {/* {session && (
        <div className="flex flex-col items-center">
          <span className="text-lg">Welcome!</span>
          <span>{session.user.fullname}</span>
        </div>
      )} */}
      {session?.user.username && (
        <button
          onClick={signOutHandler}
          className="nav-btn cursor-pointer text-sm"
        >
          Sign Out
        </button>
      )}
    </main>
  );
}

// function Roles({ session }: { session: Session }) {
//   return (
//     <div className="flex flex-col text-[8px]">
//       <div>Admin: {session?.user.isAdmin ? "true" : "false"}</div>
//       <div>Customer {session?.user.isCustomer ? "true" : "false"}</div>
//       <div>
//         ServiceProvider:
//         {session?.user.isSp ? "true" : "false"}
//       </div>
//     </div>
//   );
// }

function Loading() {
  return (
    <main
      className="
      flex flex-row h-20 
      items-center justify-between
      bg-emerald-700
      text-end
      px-4
      m-2
      rounded-2xl
      shadow-black
      shadow
      w-full
    "
    >
      Loading...
    </main>
  );
}
