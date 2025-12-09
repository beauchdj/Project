/* Jaclyn Brekke
*  November 2025
*  Appointment search function
*/

"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Appointment } from "../lib/types/Appointment";

export default function SearchAppts({setResults,}: {
  setResults: Dispatch<SetStateAction<Appointment[]>>;
}) {
  const [base, setBase] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  async function updateCategory(category: string) {
    const params = new URLSearchParams();
    if (category) params.set("serviceCategory", category.toLowerCase());

    params.set("status","Available");
    params.set("startAfter", new Date().toISOString());

    const response = await fetch(`/api/appointments?${params.toString()}`, {
      method: "GET",
    });

    if(!response.ok) {
      console.error("Failed to fetch appointment");
      return;
    }

    const data = await response.json();
    setResults(data.appointments);
    setBase(data.appointments);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search) {
        const filtered = base.filter((p) =>
          p.service.toLowerCase().includes(search)
        );
        setResults(filtered);
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
        className="w-28 md:w-36 rounded-md px-2 py-1 text-white text-sm focus:outline-none border-lime-400 border-2 focus:ring-0 bg-gradient-to-r from-emerald-500 to-emerald-700 focus:bg-emerald-600 disabled:text-white hover:bg-slate-500" 
        defaultValue=""
        onChange={(e) => {
          const category: string = e.target.value;
          updateCategory(category);
        }}
      >
        <option value="" className="text-black" disabled>
          -Services-
        </option>
        <option value="Medical">Medical</option>
        <option value="Fitness">Fitness</option>
        <option value="Beauty">Beauty</option>
      </select>
      <input
        type="text"
        onChange={(e) => setSearch(e.currentTarget.value)}
        className="ml-2 w-36 md:w-36 rounded-md px-2 py-1 text-white text-sm focus:outline-none border-lime-400 border-2 focus:ring-0 bg-gradient-to-r from-slate-600 to-emerald-700"
        placeholder="Search Services"
      />
    </section>
  );
}
