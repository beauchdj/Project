"use client";

type Props = {
    apptId: string;
    onBooked?: () => void;
};

export default function BookApptButton( { apptId, onBooked }: Props) {
    
    async function handleClick() {
        const response = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { apptId }),
        });
        onBooked?.();
    }

        return (
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handleClick}
                    className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
                >
                    Book
                </button>
            </div>
        )
}
