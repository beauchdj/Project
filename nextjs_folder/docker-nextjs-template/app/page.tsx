"use server";

import { CalendarComponent } from "./lib/calendar";
import { fetchUsers } from "./lib/queries";

type User = {
  username: string;
  password: string;
  id: string;
};

export default async function page() {
  const data: User[] = await fetchUsers();
  // if (data[0]) console.log("got this data: ", data[0].username);

  return (
    <main className="flex w-full items-center justify-center mt-8 flex-col">
      <div className="bg-slate-700 w-[80%] min-h-80 text-center rounded-3xl">
        <div className="flex justify-start items-center mb-2 pl-5 pt-3">
          <p className="m-0">User List:</p>
        </div>
        <div className="flex items-center justify-center">
          {(data.length > 0 &&
            data.map((user, index) => (
              <div
                key={index}
                className="hover:border-white hover:border w-[50%] cursor-pointer hover:rounded-4xl"
              >
                {user.username}
              </div>
            ))) || (
            <p className="text-red-400 text-2xl">No users or fetch failed!</p>
          )}
        </div>
      </div>
      <div className="w-150 h-150">
        <CalendarComponent />
      </div>
    </main>
  );
}
