"use server";

import { fetchData } from "../lib/queries";

export default async function HomePage() {
  const d = await fetchData();
  let json: string[] = [];
  let length = 0;

  if (d) {
    json = await d.json();
    length = json.length;
  }

  return (
    <main className="w-screen h-[80vh] flex justify-center items-center flex-col">
      <div className="w-full flex justify-center items-center m-2">
        hey its homepage
      </div>
      <div className="w-[90%] h-[99%] overflow-auto">
        <div className="bg-slate-700 p-4 rounded">
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
      </div>
    </main>
  );
}
