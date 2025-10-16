"use client";

import { Dispatch, SetStateAction } from "react";
import { Booking } from "../lib/types/Booking";

export default function SearchAppts({
  setResults,
}: {
  setResults: Dispatch<SetStateAction<Booking[]>>;
}) {
  async function updateCategory(category: string) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);

    const response = await fetch(`/api/openings?${params.toString()}`, {
      method: "GET",
    });

    const data = await response.json();
    setResults(data);
  }

  return (
    <section className="space-y-3">
      {/* <input
                    name="category"
                    type="text"
                    placeholder="Category"
                    className="w-28 md:w-36 rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                /> */}

      <select
        name="category"
        className="w-28 md:w-36 rounded-md px-2 py-1 text-white text-sm focus:outline-none border-lime-400 border-2 focus:ring-0"
        defaultValue=""
        onChange={(e) => {
          const category: string = e.target.value;
          updateCategory(category);
        }}
      >
        <option value="" disabled>
          Services
        </option>
        <option value="medical">Medical</option>
        <option value="fitness">Fitness</option>
        <option value="beauty">Beauty</option>
      </select>
    </section>
  );
}
