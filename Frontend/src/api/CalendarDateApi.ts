const BASE_URL = "http://localhost:5268/CalendarDates";

export async function getCalendarDate(date: Date) {
  const response = await fetch(`${BASE_URL}/${date}`);
  const data = await response.json();
  //   return data as CourseType;
}
