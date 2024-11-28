import { tokenResponse } from "@api/UserApi";
import { deleteCookie, setCookie } from "@helpers/cookieHelpers";

export function setTokenCookies(data: tokenResponse | undefined) {
    if (data === undefined) {
        return;
    }
    const { access_token, id_token, expires_in } = data;
    setCookie('access_token', access_token, expires_in);
    setCookie('JWT', id_token, expires_in);
    deleteCookie('auth_code');
    location.href = "/";
}
