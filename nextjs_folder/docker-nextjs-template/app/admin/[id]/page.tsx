/**
 * Gavin Stankovsky
 * November 2025
 *
 * This is the service side page that is fetched on /admin route
 */
import { NotificationProvider } from "@/app/lib/components/NotificationContext";
import AdminUserAppointments from "../lib/AdminUserAppoinments";

export default function AdminUserAppointmentsWrapper() {
  return (
    <NotificationProvider>
      <AdminUserAppointments />
    </NotificationProvider>
  );
}
