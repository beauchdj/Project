"use client";
import { useEffect,useState } from "react";

type Row = {
    id?: string;
    starttime: string;
    endtime: string;
    service: string;
    fullname?: string | null;
};

export default function AppointmentsList() {
    const [data, setData] = useState<Row[] | null>(null);
    const [ error, setError] = useState<string | null>(null);
    useEffect(() => {
        fetch("/api/appointments", { method: "GET" })
        .then((response) => response.json())
        .then(setData)
        .catch(setError);
        }, []);

    if (!data) {
        return (
            <div>
                 <h2 className="text-lg font-semibold mb-2">Available Appointments</h2>
            </div>
        )
    }
    return(
       <div>
      <h2 className="text-lg font-semibold mb-2">All Appointments</h2>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">Start</th>
              <th className="px-3 py-2 text-left font-semibold">End</th>
              <th className="px-3 py-2 text-left font-semibold">Service</th>
              <th className="px-3 py-2 text-left font-semibold">Customer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((row, i) => {
              const customer = row.fullname ?? "";
              return (
                <tr key={row.id ?? i} className="hover:bg-white/5">
                  <td className="px-3 py-2 whitespace-nowrap">{row.starttime}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.endtime}</td>
                  <td className="px-3 py-2">{row.service}</td>
                  <td className="px-3 py-2">{customer || <span className="opacity-60">—</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div> 
    );
}


/* <pre> {JSON.stringify(data)}</pre> */ 