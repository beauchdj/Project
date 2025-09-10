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
    <main className="w-screen h-[100%] flex justify-center">
      <div className="w-[90%] h-[99%] max-h-140 overflow-scroll">
        <div>hey its homepage</div>
        <div>
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
