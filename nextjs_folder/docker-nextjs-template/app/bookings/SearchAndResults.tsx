"use client"

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";


//is there a better place to keep types/shapes?
type SearchSlot = {
    id: string;
    date: string;
    starttime: string;
    endtime: string;
    service: string;
    providerId: string;
    providerName: string;
    providerCategory: string;
};

type Filters = {
    category: string;  //make these dropdowns that display the available options from the db...
    provider: string;
    service: string;
    date: string;
    start: string;
    end: string;
    duration: string;
};

const initialFilters: Filters = {
    category: "",
    provider: "",
    service: "",
    date: "",
    start: "",
    end: "",
    duration: "",
};

export default function SearchAndResults() {
    const router = useRouter();

    //learn more about state
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rows, setRows] = useState<SearchSlot[]>([]);
    const [bookingMsg, setBookingMsg] = useState<string | null>(null);

    // Build stable query string from filters; skip empty ones
    const searchUrl = useMemo(() => {
        const u = new URL("/api/appointments", window.location.origin);
        const add = (k: keyof Filters) => {
            const v = (filters[k] || "").trim();
            if (v) u.searchParams.set(k,v);
        };
        add("category");
        add("provider");
        add("service");
        add("date");
        add("start");
        add("end");
        add("duration");
        return u.toString();
    }, [filters]);

// Debounced fetch when filters change
  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      setPending(true);
      setError(null);
      try {
        const res = await fetch(searchUrl, { method: "GET" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data?.error ?? `Error (${res.status})`);
          if (alive) setRows([]);
        } else {
          if (alive) setRows(Array.isArray(data?.slots) ? data.slots : []);
        }
      } catch {
        if (alive) {
          setError("Network error.");
          setRows([]);
        }
      } finally {
        if (alive) setPending(false);
      }
    }, 250); // small debounce so we don't fetch on every keystroke immediately

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [searchUrl]);

  // Small helper to bind inputs
  function bind<K extends keyof Filters>(key: K) {
    return {
      name: key,
      value: filters[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setFilters((prev) => ({ ...prev, [key]: e.target.value })),
    };
  }
  // Book an appointment by id → POST /api/bookings
  async function onBook(apptId: string) {
    setBookingMsg(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apptId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setBookingMsg(data?.error ?? `Error (${res.status})`);
        return;
      }
      setBookingMsg("Booked!");
      // Refresh server components if the page has any (not required here but handy)
      router.refresh();
      // Optionally remove the booked slot from UI:
      setRows((prev) => prev.filter((r) => r.id !== apptId));
    } catch {
      setBookingMsg("Network error.");
    }
  }

  return (
    <section className="space-y-3">
      {/* Compact search toolbar */}
      <form
        className="
          flex flex-wrap items-center gap-2
          bg-emerald-800/60 p-2 rounded-lg text-sm
        "
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Category */}
        <input
          {...bind("category")}
          type="text"
          placeholder="Category"
          className="w-28 md:w-36 rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {/* Provider name */}
        <input
          {...bind("provider")}
          type="text"
          placeholder="Provider"
          className="w-32 md:w-40 rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {/* Service */}
        <input
          {...bind("service")}
          type="text"
          placeholder="Service"
          className="w-28 md:w-48 rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {/* Date */}
        <input
          {...bind("date")}
          type="date"
          className="rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {/* Start */}
        <input
          {...bind("start")}
          type="time"
          className="rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {/* End */}
        <input
          {...bind("end")}
          type="time"
          className="rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {/* Duration (minutes) */}
        <input
          {...bind("duration")}
          type="number"
          min={0}
          placeholder="Min"
          className="w-20 rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />

        {/* Status / loading message inline */}
        <span className="ml-auto pr-1 text-emerald-200">
          {pending ? "Searching…" : error ? error : rows.length ? `${rows.length} found` : "—"}
        </span>
      </form>

      {/* Optional booking message */}
      {bookingMsg && (
        <div className="rounded-lg bg-emerald-700/60 px-4 py-2 font-medium text-sm">
          {bookingMsg}
        </div>
      )}

      {/* Results table */}
      <div className="overflow-x-auto rounded-lg border border-emerald-700/50">
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-800/70 text-left">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Start</th>
              <th className="px-3 py-2">End</th>
              <th className="px-3 py-2">Service</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              // Format date/time from ISO (keep simple; adjust to your locale as needed)
              const start = new Date(r.starttime);
              const end = new Date(r.endtime);
              const date = r.date || start.toISOString().slice(0, 10); // YYYY-MM-DD
              const hhmm = (d: Date) => d.toISOString().slice(11, 16); // HH:mm UTC
              return (
                <tr key={r.id} className="odd:bg-emerald-800/30">
                  <td className="px-3 py-2">{date}</td>
                  <td className="px-3 py-2">{hhmm(start)}</td>
                  <td className="px-3 py-2">{hhmm(end)}</td>
                  <td className="px-3 py-2">{r.service}</td>
                  <td className="px-3 py-2">{r.providerName}</td>
                  <td className="px-3 py-2">{r.providerCategory}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => onBook(r.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-md font-semibold"
                    >
                      Book!
                    </button>
                  </td>
                </tr>
              );
            })}
            {!rows.length && !pending && !error && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-emerald-200">
                  No results. Try adjusting your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

