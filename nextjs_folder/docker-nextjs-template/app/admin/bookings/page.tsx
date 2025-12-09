"use server";

import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import AdminBookingList from "./AdminBookingList";

export default async function AdminBookingPage() {
  const session = await auth();

  if (!session) redirect("/login");
  if (!session.user.isAdmin) redirect("/");

  return <AdminBookingList />;
}