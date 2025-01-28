import { getCookie } from "@helpers/cookieHelpers";
import { fetchWithRefreshTokenInterceptor } from "@helpers/interceptorHelpers";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/tracks`;

export async function getTracks() {
    const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
        headers: {
            Authorization: `Bearer ${getCookie("JWT")}`,
            Accept: "application/json",
        },
    });

    return await response.json();
}