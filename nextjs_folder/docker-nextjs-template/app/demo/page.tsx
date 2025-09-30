"use server";
import { User } from "next-auth";
import { fetchUsers } from "../lib/fetching/queries";
import { UserList } from "./lib/user_list";

/**
 *
 * Common nextjs pattern is fetch data on server component (page.tsx)
 *  then use client components to manipulate that passed data and mirroring the client
 *  operations to the server with api calls
 */

// export: allow the current page, allowing other files to import this file.
// default: this is what tells nextjs which react component to show as the root component on this route (/demo)
export default async function Page() {
  // const str = "hot reload";
  const data: User[] = await fetchUsers();
  // console.log("DATA: ", data);

  return (
    <div className="flex justify-center items-center flex-col">
      <p>This is the demo page</p>
      <UserList user_list={data} />
    </div>
  );
}
