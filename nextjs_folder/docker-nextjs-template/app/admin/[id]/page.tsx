import { NotificationProvider } from "@/app/lib/components/NotificationContext";
import AdminUserAppointments from "../lib/AdminUserAppoinments";

export default function AdminUserAppointmentsWrapper() {
  return (
    <NotificationProvider>
      <AdminUserAppointments />
    </NotificationProvider>
  );
}
