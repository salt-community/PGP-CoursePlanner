import { getCookie } from "@helpers/cookieHelpers";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/CourseModules`;

export async function getModulesByCourseId(courseId: number) {
    const response = await fetch(`${BASE_URL}/${courseId}`, {
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
