// This is a **Client Component**. Client components are interactive
// and run entirely in the browser. They can use React hooks like
// useState(), useEffect(), and also browser-only APIs like fetch().

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// useState: a built-in React Hook that lets you store and update local
// component state (e.g., form loading state or messages).
// useRouter: a Next.js hook that gives you client-side navigation tools.
//   - router.push() navigates to a new page
//   - router.refresh() revalidates data for Server Components (super useful
//     when you POST data and want your server-rendered components to update)

export default function CreateAppointmentForm() {
    const router = useRouter(); // Next.js navigation object
    const [pending, setPending] = useState(false); // Track if a POST request is running
    const [msg, setMsg] = useState<string | null>(null); // Store success/error messages

      // This async function runs when the user submits the form.
      // e is the "event" object from the submit event.
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault(); // Prevent the browser from doing a full page reload.
        
        // Clear any previous messages and set loading flag
        setMsg(null);
        setPending(true);

        // FormData is a browser API that lets us read all the fields of the form.
        // We convert it into a plain json object for our API call.

        const form = new FormData(e.currentTarget);
        const payload = {
            service: String(form.get("service") || ""),
            date: String(form.get("date") || ""),
            start: String(form.get("start") || ""),
            end: String(form.get("end") || ""),
        };

        try {
            // Call our API route using fetch()
            // Since the route lies at /api/appointments,
            // this will trigger app/api/appointments/route.ts (the server handler)
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" }, // Tell the server we're sending JSON
                body: JSON.stringify(payload),
            });

            // Parse the JSON response. We wrap it in a try/catch so that if
            // the response isn't valid JSON, we don't crash.

            const data = await res.json().catch(() => ({}));

            // Handle errors or success based on response status.
            if (!res.ok) {
                //res.ok is true for 2xx responses. If not, show the error message.
                setMsg(data?.error ?? `Error (${res.status})`);
                return;
            }

            // If we reach here, the appointment was created successfully!
            setMsg("Appointment slot created.");

            // Reset the form fields (HTMLFormElement.reset() clears inputs)
            (e.target as HTMLFormElement).reset();

            // router.refresh() tells Next.js to re-run any Server Components
            // on the current page so that fresh data is fetched from the server.
            // Similar to "reloading" the page's server data, but faster.
            router.refresh();
        } catch {
            // Network errors (e.g. connection issues) land here
            setMsg("Network error.");
        } finally {
            // Always clear the loading state once finished.
            setPending(false);
        }
    }

// The returned JSX is what React renders to the page.
// In React, return values of functional components are HTML-like
// structure (JSX) to be displayed.

return (
    <form 
        onSubmit={onSubmit} 
        className="
        flex flex-wrap items-center gap-2
        bg-emerald-800/60
        p-2 rounded-lg
        text-sm"
    >
        {/* Show a message banner if msg is set */}
        {msg && (
            <span className="text-emerald-200 font-medium pr-2">
                {msg}
            </span>
        )}
        
        <input
            name="date"
            type="date"
            required
            className="rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <input
            name="start"
            type="time"
            required
            className="rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <input
            name="end"
            type="time"
            required
            className="rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <input
            name="service"
            type="text"
            placeholder="Service"
            required
            className="w-32 md:w-48 rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        {/* The form inputs map directly to the payload fields.
            React doesn't need to "control" these fields since we're
            just reading them from the DOM via FormData. */}
    
        <button
            type="submit"
            disabled={pending}
            className="
                bg-emerald-600 hover:bg-emerald-500
                text-white font-semibold
                px-3 py-1 rounded-md
                transition
            disabled:opacity-50"
        >
            {pending ? "..." : "Create"}
        </button>
    </form>
    );
}