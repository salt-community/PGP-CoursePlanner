import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrimaryBtn from "./buttons/PrimaryBtn";
import { deleteCookie } from "@helpers/cookieHelpers";
import { currentMonth, currentYear } from "@helpers/dateHelpers";

export default function NavBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogOut = () => {
    deleteCookie('JWT');
    deleteCookie("access_token");
    deleteCookie("auth_code");
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white shadow-lg">
        <div className="p-5 border-b border-gray-700">
          <Link className="text-xl font-bold text-white" to="/">
            Course Planner
          </Link>
        </div>
        <ul className="menu menu-vertical p-4 text-lg space-y-2">
          <li>
            <Link
              onClick={toggleDropdown}
              to={`/calendar/month/monthyear=${currentMonth}-${currentYear}`}
              className="hover:bg-gray-700 rounded p-2"
            >
              Calendar
            </Link>
          </li>
          <li>
            <Link
              onClick={toggleDropdown}
              to="/modules"
              className="hover:bg-gray-700 rounded p-2"
            >
              Module Templates
            </Link>
          </li>
          <li>
            <Link
              onClick={toggleDropdown}
              to="/courses"
              className="hover:bg-gray-700 rounded p-2"
            >
              Course Templates
            </Link>
          </li>
          <li>
            <Link
              onClick={toggleDropdown}
              to="/activecourses"
              className="hover:bg-gray-700 rounded p-2"
            >
              Bootcamps
            </Link>
          </li>
        </ul>
        <div className="p-4 border-t border-gray-700">
          <PrimaryBtn onClick={handleLogOut} >
            Log Out
          </PrimaryBtn>
        </div>
      </div>
    </>
  );
}
