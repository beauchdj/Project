"use client";
import { useState } from "react";
import SearchAppts from "./SearchAppts";
import AvailableApptsList from "./AvailableApptList";
import { Booking } from "../lib/types/Booking";

export default function BookingClient() {
  const [results, setResults] = useState<Booking[]>([]);

  return (
    <>
      <SearchAppts setResults={setResults} />
      <div className="mt-4">
        <AvailableApptsList data={results} />
      </div>
    </>
  );
}
