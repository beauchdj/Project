import { auth } from "../../auth"
import { redirect } from "next/navigation";
import { pool } from "../../lib/db";

export default async function CreateAppointments() {
  const session = await auth()
  if (!session) redirect("/login");
  //add check if isSP

  async function createAppt(formData: FormData) {
    "use server";

    const service = (formData.get("service") ?? "").toString().trim();
    const date = (formData.get("date") ?? "").toString();
    const start = (formData.get("start") ?? "").toString();
    const end = (formData.get("end") ?? "").toString();

    if (!service) throw new Error("Service is required.");
    if (!date || !start || !end) throw new Error("Date, Start, and End Time are required");

    const startAt = new Date(`${date}T${start}:00`);
    const endAt = new Date(`${date}T${end}:00`);

    if (!(startAt instanceof Date) || isNaN(+startAt)) throw new Error("Invalid start time.");
    if (!(endAt instanceof Date) || isNaN(+endAt)) throw new Error("Invalid end time.");
    if (endAt <= startAt) throw new Error("End time must be after start time.");

     // spId: adapt to your user ID type (string vs number)
    const spId = session?.user.id;
    //const spId = typeof spIdRaw === "string" ? parseInt(spIdRaw, 10) : spIdRaw;
    //if (!spId || Number.isNaN(spId)) throw new Error("Invalid provider id on session.");

    await pool.execute(
        `
        INSERT INTO appts (spId, service, starttime, endtime)
        VALUES (?,?,?,?)
        `,
        [spId,service,startAt,endAt]
    );
    

    //revalidatePath("/appointments");
    redirect("/appointments?created=1");
  }

  return (
    <main className="max-w-xl mx-auto p-6 bg-emerald-900 rounded-2xl text-white">
      <h1 className="text-2xl font-semibold mb-4">Create Available Appointment</h1>

      <form action={createAppt} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="service">Service</label>
          <input
            id="service"
            name="service"
            type="text"
            required
            className="w-full rounded-lg px-3 py-2 text-black"
            placeholder="e.g., Dental Cleaning"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              required
              className="w-full rounded-lg px-3 py-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="start">Start Time</label>
            <input
              id="start"
              name="start"
              type="time"
              required
              className="w-full rounded-lg px-3 py-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="end">End Time</label>
            <input
              id="end"
              name="end"
              type="time"
              required
              className="w-full rounded-lg px-3 py-2 text-black"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="nav-btn">Save</button>
          <a href="/home" className="nav-btn">Cancel</a>
        </div>
      </form>
    </main>
  );
}


  