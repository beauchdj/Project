/* Gavin Stankovsky, Jaclyn Brekke
*  December 2025 (Latest)
*  Appointment cancel button function
*/

"use client";

import { Appointment } from "../lib/types/Appointment";

type Props = {
  appointment: Appointment;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function CancelApptButton({
  appointment,
  onSuccess,
  onError,
}: Props) {
  async function handleClick() {
    try {
      // canceling an appt from sp perspective
      // add the customer id to notification as that is who it should be sent to
      /*await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          who: "sp",
          apptid: appointment.id,
          status: "Cancelled",
        }),
      });*/

      const response = await fetch(`/api/bookings/${appointment.bookingid}/cancel`, {
          //method: "PUT",
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          //body: JSON.stringify(appointment.bookingid),
          body: JSON.stringify({status: "Cancelled"})
        }
      );

      const data = await response.json(); //
      if (!response.ok) {
        onError(data.error || "Unable to cancel appointment.");
        return;
      }
      onSuccess();
    } catch {
      onError(
        "An unexpected error occurred while cancelling this appointment."
      );
    }
  }

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={handleClick}
        className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
}
