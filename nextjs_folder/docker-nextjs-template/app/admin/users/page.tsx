"use client";

import { useEffect, useState } from "react";
import { User } from "../../lib/types/User";

export default function UsersList() {
    const [users, setUsers] = useState<User[]>([]);
    
    useEffect(() => {
        fetchUsers();
    }, []);
    
    async function fetchUsers() {
        const res = await fetch("/api/users", { method: "GET" });
        const json = await res.json();
        setUsers(json);
    }

    async function setUserActiveStatus(userId: string, isactive: boolean) {
        await fetch("/api/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, isactive}),
        });

        setUsers((prev) =>
            prev.map((u) =>
            u.id === userId ? {...u, isactive } : u
            )
        );
    }
  
  if (!users.length) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-2">All Users</h2>
        <p>None</p>
      </div>
    );
  }
  return (
  <div className="p-6">
    <h2 className="text-lg font-semibold mb-4 text-white">All Users</h2>

    <div className="overflow-x-auto rounded-xl border border-white/10 bg-emerald-800 shadow-lg">
      <table className="min-w-full text-sm text-white">
        <thead className="bg-emerald-900">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Created On</th>
            <th className="px-4 py-3 text-left font-semibold">Is SP</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-emerald-700 transition-colors"
            >
              <td className="px-4 py-2 text-xs">{user.fullname}</td>
              <td className="px-4 py-2 text-xs">
                {user.created_at ? 
                  new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                    }) : "--" }
                  </td>
              <td className="px-4 py-2 text-xs">
                {user.issp ? "yes" : "no"}
              </td>
              <td className="px-4 py-2 text-xs">
                {user.isactive ? "active" : "inactive"}
              </td>
              <td className="px-4 py-2">
                {user.isactive ? (
                  <button
                    onClick={() =>
                      setUserActiveStatus(user.id!, false)
                    }
                    className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-500 transition"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setUserActiveStatus(user.id!, true)
                    }
                    className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 transition"
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}