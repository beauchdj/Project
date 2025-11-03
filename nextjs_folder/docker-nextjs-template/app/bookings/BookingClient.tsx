"use client";
import { useState } from "react";
import SearchAppts from "./SearchAppts";
import AvailableApptsList from "./AvailableApptList";
import { Booking } from "../lib/types/Booking";

export default function BookingClient() {
  const [results, setResults] = useState<Booking[]>([]);

  async function handleBook(apptId: string) {
    setResults((prev) => prev.filter((appt) => appt.id !== apptId));
  }

  return (
    <>
      <SearchAppts setResults={setResults} />
      <div className="mt-4">
        <AvailableApptsList 
          data={results}
          onBooked={handleBook} />
      </div>
    </>
  );
}
