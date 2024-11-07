import { getCookie } from "../helpers/cookieHelpers";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/CalendarDates`;

export async function getCalendarDate(date: string) {
  try {
    const response = await fetch(`${BASE_URL}/${date}`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok || response == null) {
      // alert("Failed to get applied courses");
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error(error);
    // alert("Failed to get applied courses");
  }
}

export async function getCalendarDateWeeks(week: number) {
  try {
    const response = await fetch(`${BASE_URL}/Weeks/${week}`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
      },
    });

    if (!response.ok || response == null) {
      // alert("Failed to get applied courses");
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error(error);
    // alert("Failed to get applied courses");
  }
}


export async function getCalendarDateBatch(start: string, end: string) {
  try {
    const response = await fetch(`${BASE_URL}/batch`, {
      headers: {
        Authorization: `Bearer ${getCookie("JWT")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ start, end }),
    });

    if (!response.ok || response == null) {
      // alert("Failed to get applied courses");
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error(error);
    // alert("Failed to get applied courses");
  }
}

// export async function getCalendarDateBatch(start: Date, end: Date) {
//   try {
//     const response = await fetch(`${BASE_URL}/Batch`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${getCookie("JWT")}`,
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ start, end }),
//     });

//     if (!response.ok) return;

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//   }
// }
