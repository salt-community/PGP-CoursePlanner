import { refreshToken } from "@api/user/userFetches";

export async function fetchWithRefreshTokenInterceptor(url: string, options: RequestInit) {
    const response = await fetch(url, {...options});
    
    if (response.status === 401) {
        await refreshToken();
    }
    return response;
}