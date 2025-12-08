/* Jaclyn Brekke
*  November 2025
*  Booking helper
*/

"use client";
import { useEffect, useState } from "react";
import SearchAppts from "./SearchAppts";
import ApptSearchResults from "./ApptSearchResults";
import BookedApptsList from "./BookedApptList";
import { Booking } from "../lib/types/Booking";
import { useNotification } from "../lib/components/NotificationContext";
import { Appointment } from "../lib/types/Appointment";

export default function BookingClient() {
  const [results, setResults] = useState<Appointment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState<string | null>(null);

  const { toggleHidden } = useNotification();
  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    const res = await fetch("/api/bookings?viewAs=Customer", { method: "GET" });
    const json = await res.json();
    setBookings(json.bookings);
  }

  async function handleBook(apptId: string) {
    // remove from available appointments list
    setResults((prev) => prev.filter((appt) => appt.id !== apptId));
    await fetchBookings();
    // show confirmation message
    // setConfirmation("Appointment booked successfully.");
    // setTimeout(() => setConfirmation(null), 4000);
    toggleHidden("Appointment Booked Successfully");
  }

  function handleError(message: string) {
    setError(message);
    setTimeout(() => setError(null), 5000);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function handleCancel(booking: Booking) {
    toggleHidden("Booking canceled");
  }

  return (
    <>
      <SearchAppts setResults={setResults} />
      <div className="mt-4">
        {/* {confirmation && (
          <div className="mb-4 rounded-md bg-emerald-600/90 text-white px-4 py-2">
            {confirmation}
          </div>
        )} */}
        {error && (
          <div className="mb-4 rounded-md bg-red-600/90 text-white px-4 py-2">
            {error}
          </div>
        )}
        <ApptSearchResults
          data={results}
          onBooked={handleBook}
          onError={handleError}
        />
      </div>
      <div>
        <BookedApptsList
          bookings={bookings}
          onCancel={handleCancel}
          onError={handleError}
        />
      </div>
    </>
  );
}
