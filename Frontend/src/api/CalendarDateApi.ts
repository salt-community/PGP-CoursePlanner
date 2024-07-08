import { CalendarDateType } from "../components/calendar/Types";

const BASE_URL = "http://localhost:5268/CalendarDates";

export async function getCalendarDate(date: string) {
  const response = await fetch(`${BASE_URL}/${date}`);
  if (response.ok) {
    const data = await response.json();
    return data as CalendarDateType;
  }
}