/* Gavin Stankovsky
*  October 2025
*  Calendar component 
*/

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  ChangeEvent,
  Dispatch,
  RefAttributes,
  SetStateAction,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

type State = {
  map: Map<string, number>;
  first?: [string, number];
  lookup?: number;
};

type Action =
  | { type: "print" }
  | { type: "getfirst" }
  | { type: "lookup"; key: string };

const monthMap = new Map<string, number>([
  // map that holds the number of days for each month
  ["January", 31],
  ["Febuary", 28],
  ["March", 31],
  ["April", 30],
  ["May", 31],
  ["June", 30],
  ["July", 31],
  ["August", 31],
  ["September", 30],
  ["October", 31],
  ["November", 30],
  ["December", 31],
]);

function reducer(state: State, action: Action): State {
  const newMap = new Map<string, number>(state.map);

  switch (action.type) {
    case "print":
      // console.log(newMap);
      return { ...state, map: newMap };
    case "getfirst":
      return { ...state };
    case "lookup":
      return { ...state, lookup: newMap.get(action.key) };
  }
}

const initialState: State = { map: monthMap, first: Array.from(monthMap)[0] };

/**
 * This is the entry point for the calendar component
 */
export function CalendarComponent() {
  // <Month, DayNumber>
  const [state, dispatch] = useReducer(reducer, initialState);

  const months = Array.from(monthMap);

  const [month, setMonth] = useState<string>("");
  const [dayNumbers, setDayNumbers] = useState<number[]>([]);

  // only fires
  useEffect(() => {
    // state.first: [string,number] := [Month, TotalDays] // total days in a month
    const fstMonth = state.first![0]; // gets the
    const fstDays = state.first![1];

    dispatch({ type: "print" });

    setMonth(fstMonth);

    const dayNumberArray = Array.from({ length: fstDays }, (_, i) => i + 1);
    setDayNumbers(dayNumberArray);
  }, []);

  const updateMonth = (e: ChangeEvent<HTMLSelectElement>) => {
    const curMonth: string = e.currentTarget.value as string;
    const days: number = monthMap.get(curMonth)!;

    setMonth(curMonth);
    const dayNumberArray = Array.from({ length: days }, (_, i) => i + 1);
    setDayNumbers(dayNumberArray);
  };

  return (
    <div className="bg-white w-full h-[60%] overflow-hidden p-4 rounded-xl">
      <label className="flex w-fit flex-row gap-1 text-black">
        <p className="m-0">Select a month:</p>
        <select
          value={month}
          onChange={(e) => updateMonth(e)}
          className="border rounded bg-white px-2"
        >
          {months.map(([month, days], index) => (
            <option value={month} key={index}>
              {month}
            </option>
          ))}
        </select>
        <div> Currently: {month}</div>
      </label>
      <Calendar dayNumbers={dayNumbers} />
    </div>
  );
}

function Calendar({ dayNumbers }: { dayNumbers: number[] }) {
  const [day, setDay] = useState<string>("");
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const menu = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full h-[90%]">
      <div className="overflow-hidden w-full h-full grid grid-cols-7 gap-2 p-4 rounded-xl">
        <Days days={days} />
        <DayNumbers
          items={dayNumbers as number[]}
          setDay={setDay}
          menu={menu}
        />
      </div>
      <div ref={menu} className="popup">
        <Popup menu={menu} day={day} />
      </div>
    </div>
  );
}

function Popup({
  menu,
  day,
}: {
  menu: React.RefObject<HTMLDivElement | null>;
  day: string;
}) {
  return (
    <div className="flex justify-center items-center flex-col w-full h-full">
      <div className="text-3xl font-bold">Selected Day: {day}</div>
      <button
        onClick={(e) => {
          if (menu.current) {
            menu.current.classList.remove("animate");
          }
        }}
        className="border-white border-3 px-4 cursor-pointer"
      >
        Back
      </button>
    </div>
  );
}

function Days({ days }: { days: string[] }) {
  return (
    <>
      {days.map((val, idx) => (
        <div key={idx} className="gridItem">
          {val}
        </div>
      ))}
    </>
  );
}

function DayNumbers({
  items,
  setDay,
  menu,
}: {
  items: number[];
  setDay: Dispatch<SetStateAction<string>>;
  menu: React.RefObject<HTMLDivElement | null>;
}) {
  function demoAsync(day: string) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (day) {
          resolve(`Operation succeeded! ${day}`);
        } else {
          reject("Operation failed!");
        }
      }, 1000); // 1 second delay
    });
  }

  async function consumeDate(day: string) {
    if (menu.current && day) {
      menu.current.classList.add("animate");
      setDay(day);
      // const promise = demoAsync(day); // example async operation for mock backend request
      // const data = await promise;
      // console.log("Got this data", data);
    }
  }
  return (
    <>
      {items.map((value, index) => (
        <div
          key={index}
          data-id={value}
          className="gridItem"
          onClick={(e) => consumeDate(e.currentTarget.dataset.id as string)}
        >
          {value}
        </div>
      ))}
    </>
  );
}
