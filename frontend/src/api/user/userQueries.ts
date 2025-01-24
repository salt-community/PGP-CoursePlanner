import { useQuery } from "@tanstack/react-query";
import { getToken, refreshToken, tokenResponse } from "./userFetches";
import { setTokenCookies } from "@helpers/cookieHelpers";

export function useQueryToken() {
    const { data } = useQuery<tokenResponse>({
        queryKey: ['accessCode'],
        queryFn: getToken,
    })
    setTokenCookies(data);
}


export function useRefrehToken() {
    const { data } = useQuery<tokenResponse>({
        queryKey: ['accessCode'],
        queryFn: refreshToken,
    })
    setTokenCookies(data);
}