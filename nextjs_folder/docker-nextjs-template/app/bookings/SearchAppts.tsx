"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Booking } from "../lib/types/Booking";

export default function SearchAppts({
  setResults,
}: {
  results: Booking[];
  setResults: Dispatch<SetStateAction<Booking[]>>;
}) {
  const [base, setBase] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  async function updateCategory(category: string) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);

    const response = await fetch(`/api/openings?${params.toString()}`, {
      method: "GET",
    });

    const data = await response.json();
    setResults(data);
    setBase(data);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search) {
        setResults((p) =>
          p.filter((p) => p.service.toLowerCase().includes(search))
        );
      } else {
        setResults(base);
      }
    }, 500);

    return () => clearTimeout(timeoutId); // cancel previous timeout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <section className="space-y-3">
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
      <input
        type="text"
        onChange={(e) => setSearch(e.currentTarget.value)}
        className="ml-2 w-36 md:w-36 rounded-md px-2 py-1 text-white text-sm focus:outline-none border-lime-400 border-2 focus:ring-0"
        placeholder="Search Services"
      />
    </section>
  );
}
