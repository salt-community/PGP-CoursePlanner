import { TrackRequest } from "@api/Types";
import { getCookie } from "@helpers/cookieHelpers";
import { fetchWithRefreshTokenInterceptor } from "@helpers/interceptorHelpers";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/tracks`;

export async function getTracks() {
    const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
        headers: {
            Authorization: `Bearer ${getCookie("id_token")}`,
            Accept: "application/json",
        },
    });

    return await response.json();
}

export async function postTrack(track: TrackRequest) {
    const response = await fetchWithRefreshTokenInterceptor(BASE_URL, {
        method: "POST",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            Authorization: `Bearer ${getCookie("id_token")}`,
            Accept: "application/json",
        },
        body: JSON.stringify(track),
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }
}