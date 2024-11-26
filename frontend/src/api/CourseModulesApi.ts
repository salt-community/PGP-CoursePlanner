import { getCookie } from "@helpers/cookieHelpers";
import { ModuleType } from "@models/module/Types";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/CourseModules`;

export async function getModulesByCourseId(courseId: number) {
    try {
        const response = await fetch(`${BASE_URL}/${courseId}`, {
            headers: {
                Authorization: `Bearer ${getCookie("JWT")}`,
                Accept: "application/json",
            },
        });

        const data: ModuleType[] = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw new Error("Could not get moduels");
        // alert("Failed to get modules");
    }
}
