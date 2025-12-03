import { NotificationProvider } from "@/app/lib/components/NotificationContext";
import AdminUserAppointments from "../lib/AdminUserAppoinments";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminUserAppointmentsWrapper() {
  const session = await auth();
  const isAdmin = session?.user.isAdmin;

  if (!session && !isAdmin) {
    redirect("/");
  }

  return (
    <NotificationProvider>
      <AdminUserAppointments />
    </NotificationProvider>
  );
}
