import { getCookie } from "@helpers/cookieHelpers";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/CourseModules`;

export async function getModulesByCourseId(courseId: number) {
    try {
        const response = await fetch(`${BASE_URL}/${courseId}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWT")}`,
                Accept: "application/json",
            },
        });

        if (!response.ok || response == null) {
            // alert("Failed to get modules by course");
            return;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        // alert("Failed to get modules");
    }
}
