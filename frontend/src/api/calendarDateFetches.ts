import { getCookie } from "@helpers/cookieHelpers";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/CalendarDates`;

export async function getCalendarDateBatch(startDate: string, endDate: string) {
  const response = await fetch(`${BASE_URL}/batch?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function getCalendarDateWeeks(week: number) {
  const response = await fetch(`${BASE_URL}/Weeks/${week}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function getCalendarDate(date: string) {
  const response = await fetch(`${BASE_URL}/${date}`, {
    headers: {
      Authorization: `Bearer ${getCookie("JWT")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}