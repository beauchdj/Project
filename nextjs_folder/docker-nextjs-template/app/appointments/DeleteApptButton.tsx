"use client";

type Props = {
  apptId: string;
  onSuccess: () => void;
};

export default function DeleteApptButton({ apptId, onSuccess }: Props) {
  async function handleClick() {
    // const response = await fetch(`/api/bookings?apptId=${apptId}`, {
    const response = await fetch("/api/appointments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apptId }),
    });
    onSuccess();
  }

  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        onClick={handleClick}
        className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
      >
        Delete
      </button>
    </div>
  );
}
