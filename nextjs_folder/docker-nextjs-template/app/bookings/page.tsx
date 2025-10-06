import { auth } from "../../auth"
import { redirect } from "next/navigation";
import SearchAndResults from "./SearchAndResults";

export default async function BookingPage() {
    const session = await auth()
    if (!session) redirect("/login");

   return (
    <main className="w-full bg-emerald-900 text-white px-4 py-3">
      <h1 className="text-lg font-semibold mb-3">Find and Book Appointments</h1>
      <SearchAndResults />
    </main>
  );
}