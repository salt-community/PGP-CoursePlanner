import Login from "@models/login/Login";
import { getCookie, setCookie } from "@helpers/cookieHelpers";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";
import { getToken } from "@api/user/userFetches";


type Props = {
  children: React.ReactNode;
}


export default function Page({ children }: Props) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    const savedState = localStorage.getItem("isSidebarExpanded");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  if (location.search) {
    const authCode = new URLSearchParams(location.search).get('code');
    if (authCode !== null) {
      setCookie("auth_code", authCode);
      getToken();
    }
  }

  useEffect(() => {
    localStorage.setItem("isSidebarExpanded", JSON.stringify(isSidebarExpanded));
  }, [isSidebarExpanded]);

  return (
    <>
      {!getCookie("auth_code") && (!getCookie("JWT") || !getCookie("access_token"))
        ? <Login />
        : (
          <>
            <NavBar isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />
            <div className={`transition-all duration-200 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} flex-1 p-4 h-screen flex flex-col`}>
              {children}
            </div>
          </>
        )}
    </>
  );
}