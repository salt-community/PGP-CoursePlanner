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
    <div
      className={`fixed left-0 top-0 h-full bg-[#ff7961] text-white shadow-lg transition-all duration-200 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}
    >
      <div className="p-6 flex items-center justify-between">
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
      <ul className="menu menu-vertical p-4 text-lg space-y-2 overflow-hidden">
        <li>
          <Link

            to={`/calendar/month/monthyear=${currentMonth}-${currentYear}`}
            className="hover:bg-gray-700 rounded p-2 flex items-center whitespace-nowrap"
          >
            <span className="mr-2">📅</span>
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