import { getCookie } from "@helpers/cookieHelpers";
import { GoogleEvent } from "@helpers/googleHelpers";
import { fetchWithRefreshTokenInterceptor } from "@helpers/interceptorHelpers";

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

const BASE_URL = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

export const getGoogleCourseEvents = async (course: string): Promise<EventDataArr> => {
  const response = await fetchWithRefreshTokenInterceptor(BASE_URL + `?sharedExtendedProperty=course%3D${course}`, {
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

export async function postCourseToGoogle(eventTemplate: GoogleEvent[]) {
  try {
    for (const event of eventTemplate) {
      await postSingleGoogleEvent(event);
    }
    alert("Events added, check your Google Calendar!");
  } catch (error) {
    alert("Failed to add events to google calendar!");
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unknown error");
    }
  }
}

export async function postSingleGoogleEvent(event: GoogleEvent) {
  const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${getCookie("access_token")}`,
    },
    body: JSON.stringify(event),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
}

export async function deleteCourseFromGoogle(course: string) {
  try {
    const courseEvents = await getGoogleCourseEvents(course);
    for (const event of courseEvents.items) {
      await deleteSingleGoogleEvent(event.id);
    }
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

export async function deleteSingleGoogleEvent(eventId: string) {
  const response = await fetchWithRefreshTokenInterceptor(BASE_URL + `/${eventId}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${getCookie("access_token")}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
}

