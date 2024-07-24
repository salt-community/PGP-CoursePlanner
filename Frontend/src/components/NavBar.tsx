import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PrimaryBtn from "./buttons/PrimaryBtn";
import { deleteCookie } from "../helpers/cookieHelpers";

export default function NavBar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogOut = () => {
    deleteCookie('JWT');
    deleteCookie("access_token");
    navigate(`/`)
    window.location.reload();
  };

  return (
    <>
      <div className="navbar mb-5 md:mb-10 animate-fade-down border-b">
        <div className="navbar-start">
          <div className="dropdown bg-white">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost md:hidden"
              onClick={toggleDropdown}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ${isOpen ? "block" : "hidden"
                }`}
            >
              <li>
                <Link onClick={toggleDropdown} to="/calendar/month">
                  Calendar
                </Link>
              </li>
              <li>
                <Link onClick={toggleDropdown} to="/modules">
                  Module template 
                </Link>
              </li>
              <li>
                <Link onClick={toggleDropdown} to="/courses">
                  Courses
                </Link>
              </li>
              <li>
                <Link onClick={toggleDropdown} to="/activecourses">
                  Active courses
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <Link className="btn btn-ghost text-l text-xl" to="/">
              Course Planner
            </Link>
          </div>
        </div>
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1 text-xl">
            <li>
              <Link onClick={toggleDropdown} to="/calendar/month">
                Calendar
              </Link>
            </li>
            <li>
              <Link onClick={toggleDropdown} to="/modules">
                Modules
              </Link>
            </li>
            <li>
              <Link onClick={toggleDropdown} to="/courses">
                Courses
              </Link>
            </li>
            <li>
              <Link onClick={toggleDropdown} to="/activecourses">
                Active courses
              </Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <PrimaryBtn onClick={handleLogOut}>Log Out</PrimaryBtn>
        </div>
      </div >
    </>
  )
}