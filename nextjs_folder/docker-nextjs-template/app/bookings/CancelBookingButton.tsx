"use client";

import { useState } from "react";
import { Booking } from "../lib/types/Booking";

type Props = {
  booking: Booking;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function CancelBookingButton({
  booking,
  onSuccess,
  onError,
}: Props) {
  const [cancelled, setCancelled] = useState<boolean>(false);
  async function handleClick() {
    try {
      // As a customer/consumer of appointments we want to send notification to Service provider
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          who: "cust",
          apptid: booking.apptid,
          status: "Cancelled",
        }),
      });
      const response = await fetch(`/api/bookings/${booking.id}/cancel`, {
        //method: "PUT",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        //body: JSON.stringify(booking.id),
        body: JSON.stringify({ status: "Cancelled"})
      });

      const data = await response.json(); //
      if (!response.ok) {
        onError(data.error || "Unable to cancel appointment.");
        return;
      }
      onSuccess();
      setCancelled(true);
    } catch (error) {
      console.log("ERROR INSIDE OF CANCELBOOKINGBUTTON: ", error);
      onError(
        "An unexpected error occurred while cancelling this appointment."
      );
    }
  }

  return (
    <div className="flex items-center">
      {cancelled ? (
        <span>Cancelled</span>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
