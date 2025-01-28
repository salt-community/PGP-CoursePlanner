import { refreshToken } from "@api/user/userFetches";
import { setTokenCookies } from "./cookieHelpers";

export async function fetchWithRefreshTokenInterceptor(url: string, options: RequestInit) {
    const response = await fetch(url, {...options});
    
    if (response.status === 401) {
        setTokenCookies(await refreshToken());
    }
    return response;
}