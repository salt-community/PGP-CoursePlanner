import { Link, useNavigate } from "react-router-dom";
import { deleteCookie } from "@helpers/cookieHelpers";
import { currentMonth, currentYear } from "@helpers/dateHelpers";

type Props = {
  isSidebarExpanded: boolean,
  setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NavBar({ isSidebarExpanded, setIsSidebarExpanded }: Props) {
  const navigate = useNavigate();

  const handleLogOut = () => {
    deleteCookie('JWT');
    deleteCookie("access_token");
    deleteCookie("auth_code");
    navigate("/");
    window.location.reload();
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-[#ff7961] text-white shadow-lg transition-all duration-200 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>

      <div className={`p-6 h-28 flex items-center ${isSidebarExpanded ? 'justify-between' : 'justify-center pb-10'}`}>
        <Link className={`flex flex-col text-xl ${isSidebarExpanded ? 'font-light' : 'font-bold'} text-white whitespace-nowrap`} to="/">
          {isSidebarExpanded && <img src="https://salt.dev/wp-content/uploads/2024/02/salt-logo-light.svg" alt="logo" />}
          {isSidebarExpanded ? "Course Planner" : "</>"}
        </Link>
        {isSidebarExpanded ?
          <button
            onClick={toggleSidebar}
            className="absolute right-[-24px] text-white text-3xl font-bold bg-primary-content p-4 mask mask-circle"
          >
            {"<"}
          </button>
          :
          <button
            onClick={toggleSidebar}
            className="absolute right-[-12px] text-white text-lg font-bold bg-primary-content p-2 mask mask-circle"
          >
            {">"}
          </button>}
      </div>

      <ul className="menu menu-vertical text-center p-0 text-lg overflow-hidden">
        <li className="hover:bg-primary-content">
          <Link

            to={`/`}
            className={`flex ${isSidebarExpanded ? '' : 'justify-center'} text-2xl`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            {isSidebarExpanded && "Home"}
          </Link>
        </li>
        <li>
          <Link

            to={`/calendar/month/monthyear=${currentMonth}-${currentYear}`}
            className="hover:bg-primary-content rounded p-2 flex items-center whitespace-nowrap"
          >
            <span className="">📅</span>
            {isSidebarExpanded && "Calendar"}
          </Link>
        </li>
        <li>
          <Link

            to="/modules"
            className="hover:bg-gray-700 rounded p-2 flex items-center whitespace-nowrap"
          >
            <span className="mr-2">📂</span>
            {isSidebarExpanded && "Module Templates"}
          </Link>
        </li>
        <li>
          <Link

            to="/courses"
            className="hover:bg-gray-700 rounded p-2 flex items-center whitespace-nowrap"
          >
            <span className="mr-2">📘</span>
            {isSidebarExpanded && "Course Templates"}
          </Link>
        </li>
        <li>
          <Link

            to="/activecourses"
            className="hover:bg-gray-700 rounded p-2 flex items-center whitespace-nowrap"
          >
            <span className="mr-2">🚀</span>
            {isSidebarExpanded && "Bootcamps"}
          </Link>
        </li>
      </ul>
      <div className="fixed top-4 right-4">
        <button className="btn btn-secondary" onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </div>
  );
}