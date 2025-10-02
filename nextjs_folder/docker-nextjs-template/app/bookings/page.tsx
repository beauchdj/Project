"use server";
import { auth } from "../../auth"
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth()
    if (!session) redirect("/login");
  return (
    <div>
      <h1>This is the Bookings Page for {session.user.fullname}</h1>
    </div>
  )
}