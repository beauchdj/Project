"use client";
import { useEffect } from "react";
import { useState } from "react";
//add useState for re-rendering on data fetch

export default function AppointmentsList() {
    const [data, setData] = useState(null);
    const [ error, setError] = useState(null);
    useEffect(() => {
        fetch("/api/appointments", { method: "GET" })
        .then((response) => response.json())
        .then(setData)
        .catch(setError);
        }, []);

    return(
        <div>
            <h2> Appointments </h2>
            <pre> {JSON.stringify(data)}</pre>
        </div>
    )
}