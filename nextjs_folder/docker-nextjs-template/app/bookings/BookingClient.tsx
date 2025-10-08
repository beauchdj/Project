"use client";
import { useState } from  "react";
import SearchAppts from "./SearchAppts";
import AvailableApptsList from "./AvailableApptList";

export type OpeningsResult = any[];

export default function BookingClient() {
    const [results, setResults] = useState<OpeningsResult | null>(null);

    return (
        <>
            <SearchAppts onResults={setResults} />
            <div className="mt-4">
                <AvailableApptsList data={results} />
            </div>
        </>
    );
}