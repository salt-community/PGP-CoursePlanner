import { useQuery } from "@tanstack/react-query";
import { getToken, tokenResponse } from "./userFetches";
import { setTokenCookies } from "@helpers/cookieHelpers";

export function useQueryToken() {
    const { data } = useQuery<tokenResponse>({
        queryKey: ['accessCode'],
        queryFn: getToken,
    })
    setTokenCookies(data);
}