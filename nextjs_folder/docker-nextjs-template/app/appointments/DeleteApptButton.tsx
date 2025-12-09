/* Gavin Stankovsky, Jaclyn Brekke
*  December 2025 (Latest)
*  Appointment delete button functionality
*/

"use client";

type Props = {
  apptId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export default function DeleteApptButton({ apptId, onSuccess, onError }: Props) {
  async function handleClick() {
    
    const response = await fetch(`/api/appointments/${apptId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isactive: false }),
    });
    const data = await response.json();
    if (!response.ok) {
        onError(data.error || "Unable to cancel appointment.");
        return;
      }
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
