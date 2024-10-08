import { getCookie } from "../helpers/cookieHelpers";
import { GoogleEvent } from "../helpers/googleHelpers";

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
  try {
    eventTemplate.map(async (event) => {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
        body: JSON.stringify(event),
      });
      const data = await response.json();
      return data;
    });
  } catch (error) {
    console.error("Error creating events", error);
    alert("Failed to create events");
  }
}

export async function deleteSingleGoogleEvent(eventId: string) {
  await fetch(
    BASE_URL + `/${eventId}?key=${import.meta.env.VITE_APP_API_KEY}`,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${getCookie("access_token")}`,
      },
    }
  );
}

export const getGoogleCourseEvents = async (
  course: string
): Promise<string[] | null> => {
  try {
    const response = await fetch(
      BASE_URL +
        `?sharedExtendedProperty=course%3D${course}&key=${
          import.meta.env.VITE_APP_API_KEY
        }`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const eventDataArr: EventDataArr = await response.json();
    return eventDataArr.items.map((event) => event.id);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return null;
  }
};

export async function deleteCourseFromGoogle(course: string) {
  const result = await getGoogleCourseEvents(course);
  if (result) {
    result.map((event) => deleteSingleGoogleEvent(event));
    alert("Event deleted, check your Google Calendar!");
  } else {
    console.log("Could not find any events with course ", course);
  }
}
