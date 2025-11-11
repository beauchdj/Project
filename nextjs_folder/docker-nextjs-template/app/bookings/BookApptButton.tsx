"use client";

type Props = {
  apptId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function BookApptButton({ apptId, onSuccess, onError }: Props) {
  async function handleClick() {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apptId }),
      });

      const data = await response.json(); //
      if (!response.ok) {
        onError(data.error || "Unable to book appointment.");
        return;
      }
      onSuccess();
    } catch {
      onError("An unexpected error occurred while booking this appointment.");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
      >
        Book
      </button>
    </div>
  );
}
