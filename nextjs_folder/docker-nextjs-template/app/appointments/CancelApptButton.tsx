
"use client";

type Props = {
  bookingId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function CancelApptButton({ bookingId, onSuccess, onError }: Props) {
  async function handleClick() {
   try {
    const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });

    const data = await response.json(); //
      if (!response.ok) {
        onError(data.error || "Unable to cancel appointment.");
        return;
      }
    onSuccess();
    } catch {
      onError("An unexpected error occurred while cancelling this appointment.");
    }
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
