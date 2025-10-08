"use client";

export default function CreateApptForm() {
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service: formData.get("service"),
        date: formData.get("date"),
        starttime: formData.get("starttime"),
        endtime: formData.get("endtime"),
      }),
    });

    const data = await response.json();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-wrap items-center gap-2 bg-emerald-800/60 p-2 rounded-lg text-sm"
    >
      <input
        name="date"
        type="date"
        required
        className="rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <input
        name="starttime"
        type="time"
        required
        className="rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <input
        name="endtime"
        type="time"
        required
        className="rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <input
        name="service"
        type="text"
        placeholder="Service description"
        required
        className="w-32 md:w-48 rounded-md px-2 py-1 text-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />

      <button
        type="submit"
        className="
                    bg-emerald-600 hover:bg-emerald-500
                    text-white font-semibold
                    px-3 py-1 rounded-md
                    transition
                disabled:opacity-50"
      >
        Create
      </button>
    </form>
  );
}
