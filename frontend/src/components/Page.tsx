import Login from "@models/login/Login";
import { getCookie, setCookie } from "@helpers/cookieHelpers";
import { useQueryToken } from "@api/user/userQueries";
import NavBar from "./NavBar";
import { useEffect, useState } from "react";


type Props = {
  children: React.ReactNode;
}


export default function Page({ children }: Props) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    const savedState = localStorage.getItem("isSidebarExpanded");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    localStorage.setItem("isSidebarExpanded", JSON.stringify(isSidebarExpanded));
  }, [isSidebarExpanded]);

  useQueryToken();

  if (location.search) {
    const authCode = new URLSearchParams(location.search).get('code');
    if (authCode !== null) {
      setCookie("auth_code", authCode);
    }
  }

  return (
    <>
      {!getCookie("auth_code") && (!getCookie("JWT") || !getCookie("access_token"))
        ? <Login />
        : (
          <>
            <NavBar isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />
            <header className="absolute top-0 right-0 flex justify-end p-8 pb-2 mr-5">
              <button className="btn btn-secondary text-xl min-h-10 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                Reminder</button>
            </header>
            <div className={`transition-all duration-200 ${isSidebarExpanded ? 'ml-64' : 'ml-20'} flex-1 p-4 h-screen flex flex-col`}>
              {children}
            </div>
          </>
        )}
    </>
  );
}