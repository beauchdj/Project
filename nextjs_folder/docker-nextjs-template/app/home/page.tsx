/* Gavin Stankovsky
*  September 2025
*  Redirect to the root page, with potential for added features if needed
*/

"use server";

import { auth } from "@/auth";
import { fetchData } from "../../lib/queries";
import { redirect } from "next/navigation";

export default async function HomePage() {
  redirect("/"); // dont allow visits to /home goto -> /
  const d = await fetchData();
  let json: string[] = [];
  let length = 0;
  const session = await auth();

  // console.log("what is session: ", session, session?.user.isCustomer);

  if (d) {
    json = await d!.json();
    length = json.length;
  }

  return (
    <main className="w-screen h-[80vh] flex justify-center items-center flex-col">
      <div className="w-full flex justify-center items-center m-2">
        hey its homepage
        {session?.user && <div>{}</div>}
      </div>
      <div className="w-[90%] h-[99%] overflow-auto">
        {(length > 0 &&
          json.map((baconipsum, index) => (
            <div
              key={index}
              className="rounded-2xl p-4 m-2 bg-black/85 text-white"
            >
              {baconipsum}
            </div>
          ))) || <>Fetch failed!</>}
      </div>
    </main>
  );
}
