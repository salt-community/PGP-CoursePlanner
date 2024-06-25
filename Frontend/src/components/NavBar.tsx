import { useState } from "react";
import { Link } from "react-router-dom";
import PrimaryBtn from "./buttons/PrimaryBtn";


export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const emptyFunction = () => { };

  return (
    // <div className="navbar bg-base-100">

    // </div>

    <>
      <div className="navbar mb-5 md:mb-10 animate-fade-down">
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
              <Link to="/"><li>
                <a onClick={toggleDropdown}>Home</a>
              </li>
              </Link>
              <li>
                <Link to="/Modules">
                  <a onClick={toggleDropdown}>Modules</a>
                </Link>
              </li>
              <li>
                <Link to="/Courses">
                  <a onClick={toggleDropdown}>Courses</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <Link to="/">
            <a className="btn btn-ghost text-xl">Course Planner</a>
          </Link>
        </div >
        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1 text-xl">
            <Link to="/">
              <li>
                <a>Home</a>
              </li>
            </Link>
            <li>
              <Link to="/Modules">
                <a>Modules</a>
              </Link>
            </li>

            <li>
              <Link to="/Courses">
                <a>Courses</a>
              </Link>
            </li>
          </ul>
        </div>

        <PrimaryBtn onClick={emptyFunction}>Login</PrimaryBtn>
      </div >
    </>
  )
}