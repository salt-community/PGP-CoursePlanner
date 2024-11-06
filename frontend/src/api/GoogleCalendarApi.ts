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

      if (!response.ok || response == null) {
        alert("Failed to add course to google calendar!");
        return;
      }
      const data = await response.json();
      return data;
    });
  } catch (error) {
    console.error("Error creating events", error);
    alert("Failed to create events");
  }
}

export async function deleteSingleGoogleEvent(eventId: string) {
  try {
    await fetch(
      BASE_URL + `/${eventId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getCookie("access_token")}`,
        },
      }
    );
  } catch (error) {
    console.error(error);
    alert("Failed to delete events");
  }
}

export const getGoogleCourseEvents = async (
  course: string
): Promise<string[] | undefined> => {
  try {
    const response = await fetch(
      BASE_URL +
        `?sharedExtendedProperty=course%3D${course}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("access_token")}`,
          Accept: "application/json",
        },
      }
    );
    if (!response.ok || response == undefined) {
      alert("Failed to get google events");
      return;
    }

    const eventDataArr: EventDataArr = await response.json();
    return eventDataArr.items.map((event) => event.id);
  } catch (error) {
    console.error("There was a problem with the fetch operation: ", error);
    return;
  }
};

export async function deleteCourseFromGoogle(course: string) {
  try {
    const result = await getGoogleCourseEvents(course);
    if (result) {
      result.map((event) => deleteSingleGoogleEvent(event));
      alert("Event deleted, check your Google Calendar!");
    }
  } catch (error) {
    console.error(error);
  }
}
