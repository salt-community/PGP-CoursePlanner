import { getCookie } from "@helpers/cookieHelpers";
import { GoogleEvent } from "@helpers/googleHelpers";

interface EventData {
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
  location: string;
  id: string;
}

interface EventDataArr {
  items: EventData[];
}

const BASE_URL =
  "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export async function postCourseToGoogle(eventTemplate: GoogleEvent[]) {
  eventTemplate.map(async (event) => {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      alert("Failed to add events to google calendar!");
      throw new Error(response.statusText);
    }
    alert("Events added, check your Google Calendar!");
    return await response.json();
  });
}

export async function deleteSingleGoogleEvent(eventId: string) {
  const response = await fetch(BASE_URL + `/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${getCookie("access_token")}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export const getGoogleCourseEvents = async (course: string): Promise<EventDataArr> => {
  const response = await fetch(BASE_URL + `?sharedExtendedProperty=course%3D${course}`, {
    headers: {
      Authorization: `Bearer ${getCookie("access_token")}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
}

export async function deleteCourseFromGoogle(course: string) {
  try {
    const courseEvents = await getGoogleCourseEvents(course);
    courseEvents.items.forEach((event) => deleteSingleGoogleEvent(event.id));
    alert("Events deleted, check your Google Calendar!");
  } catch (error) {
    alert("Failed to delete Google events");
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error");
    }
  }
}
