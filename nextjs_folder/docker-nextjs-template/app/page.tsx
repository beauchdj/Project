"use server";

import { fetchUsers } from "./lib/queries";

type User = {
  username: string;
  password: string;
  id: string;
};
export default async function page() {
  const data: User[] = await fetchUsers();
  if (data[0]) console.log("got this data: ", data[0].username);

  return (
    <>
      <main className="flex w-full items-center justify-center mt-8 ">
        {/* <h1 className="px-4 py-2 text-2xl bg-white text-black rounded-3xl">
          ID: {data[0].id} <br></br> Username: {data[0].username}
          <br></br> Password:{data[0].password}
        </h1> */}
      </main>
    </>
  );
}
