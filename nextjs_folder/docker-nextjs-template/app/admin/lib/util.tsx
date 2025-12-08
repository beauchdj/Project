import { Appointment } from "@/app/lib/types/Appointment";
import { Dispatch, SetStateAction } from "react";

/* Kind of ugly how this is going but it works... */
export const filterDate = (
  startdate: number,
  enddate: number,
  setAppts: Dispatch<SetStateAction<Appointment[]>>,
  setError: Dispatch<SetStateAction<string>>,
  appt_list: Appointment[]
) => {
  if (startdate > enddate && enddate !== 0) {
    setAppts([]);
    throw new Error("Start date cannot be before end date");
  }
  let updated: Appointment[] = [];
  // filter if only given startdate
  console.log("CHekc: ", enddate, !enddate);
  if (!enddate) {
    updated = appt_list.filter((appt) => {
      const apptStart = new Date(appt.starttime);
      const startNum = new Date(
        apptStart.getFullYear(),
        apptStart.getMonth(),
        apptStart.getDate(),
        0,
        0
      ).getTime();
      if (startNum >= startdate) return appt;
    });
  } else {
    // filter dates
    updated = appt_list.filter((appt) => {
      const apptStart = new Date(appt.starttime);
      const startNum = new Date(
        apptStart.getFullYear(),
        apptStart.getMonth(),
        apptStart.getDate(),
        0,
        0
      ).getTime();
      const apptEnd = new Date(appt.endtime);
      const endNum = new Date(
        apptEnd.getFullYear(),
        apptEnd.getMonth(),
        apptEnd.getDate(),
        0,
        0
      ).getTime();
      if (startdate <= startNum && enddate >= endNum) return appt;
    });
  }

  // sort
  updated.sort(
    (a, b) => new Date(a.starttime).getTime() - new Date(b.starttime).getTime()
  );
  setAppts(updated);
};
