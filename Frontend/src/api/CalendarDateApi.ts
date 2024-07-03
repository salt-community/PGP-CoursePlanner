import { CalendarDateType } from "../components/calendar/Types";

const BASE_URL = "http://localhost:5268/CalendarDates";

export async function getCalendarDate(date: string) {
  const response = await fetch(`${BASE_URL}/${date}`);
  console.log("URL", `${BASE_URL}/${date}`)
  const data = await response.json();
    return data as CalendarDateType;
}

// http://localhost:5268/CalendarDates/Tue Jul 02 2024 00:00:00 GMT+0200 (Central European Summer Time)
