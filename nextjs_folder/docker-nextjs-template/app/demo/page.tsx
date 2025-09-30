import { User } from "next-auth";
import { fetchUsers } from "../lib/fetching/queries";

export default async function Page() {
  // export: allow the current page, allowing other files to import this file.
  // default: this is the
  // const str = "hot reload";
  const data: User[] = await fetchUsers();
  console.log("DATA: ", data);

  return (
    <div className="flex justify-content items-center bg-amber-500 w-full text-white">
      <p>This is the demo page</p>
      {data.map((user, index) => (
        <div key={index}>{user.username}</div>
      ))}
    </div>
  );
}
