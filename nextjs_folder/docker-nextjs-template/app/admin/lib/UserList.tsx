"use client";
import { User } from "@/app/lib/types/User";
import Link from "next/link";
import { useState } from "react";

export function UserList({ users }: { users: User[] }) {
  return (
    <div className="w-full flex justify-center items-center flex-col">
      <div className="relative flex flex-col w-3/4 md:items-center overflow-auto h-[80vh] pb-1 bg-emerald-800/80 text-white rounded-2xl border-black border-[2px]">
        <Link
          className="z-1 hover:bg-emerald-300 active:bg-emerald-300 absolute left-4 top-4 px-2 bg-[rgb(70,207,57)] text-white rounded border-1 border-black"
          href={"/admin"}
        >
          Back
        </Link>
        <div className="w-full text-center text-xl bg-emerald-900 py-1 ">
          <p className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-200 to-green-400 flex flex-col">
            User List
            <span className="text-xs text-red-500">
              NOTE: Changing activation status is a destructive operation!
            </span>
          </p>
        </div>
        <table className="w-full border-collapse text-center text-xs">
          <thead className="bg-emerald-900 sticky top-0 text-white">
            <tr>
              <th className="py-2">Full Name</th>
              <th>Type</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr></tr>
            ) : (
              <>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-white/10 border-b-[1px] h-14 text-white text-sm hover:bg-emerald-200/20"
                  >
                    <td>{user.fullname}</td>
                    <td>{user.issp ? <>ServiceProvider</> : <>Customer</>} </td>
                    <td>
                      <DeleteUser userid={user.id} isactive={user.isactive} />
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeleteUser({
  userid,
  isactive,
}: {
  userid: string;
  isactive: boolean;
}) {
  const [active, setActive] = useState<boolean>(isactive);
  async function handleDelete() {
    const res = await fetch(`/api/users?id=${userid}&isactive=${active}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setActive((p) => !p);
    }
  }
  return (
    <button
      onClick={handleDelete}
      className="w-12 py-1 px-2 bg-red-700 active:bg-red-500 cursor-pointer rounded text-white border-1 border-black"
    >
      {active ? <>True</> : <>False</>}
    </button>
  );
}
