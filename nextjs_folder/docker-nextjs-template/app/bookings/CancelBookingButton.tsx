
"use client";

type Props = {
  bookingId: string;
  onSuccess: () => void;
};

export default function CancelBookingButton({ bookingId, onSuccess }: Props) {
  async function handleClick() {
    const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });
    onSuccess();
  }

  return (
    <div className="flex items-center gap-2">
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