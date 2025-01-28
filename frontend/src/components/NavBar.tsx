import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { deleteCookie } from "@helpers/cookieHelpers";
import { currentMonth, currentYear } from "@helpers/dateHelpers";
import { useContext, useEffect, useMemo, useState } from "react";
import { useQueryAppliedCourses } from "@api/appliedCourse/appliedCourseQueries";
import { useQueryTracks } from "@api/track/trackQueries";
import { getStorageTrackVisibility, initialStorageTrackVisibility, updateStorageTrackVisibility } from "@helpers/localStorage";
import VisibilityButton from "./VisibilityButton";
import { TrackVisibilityContext } from "../context/TrackVisibilityContext";
import { refreshToken } from "@api/user/userFetches";

type Props = {
  isSidebarExpanded: boolean,
  setIsSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NavBar({ isSidebarExpanded, setIsSidebarExpanded }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [bootcampIsActive, setBootcampIsActive] = useState(false);
  const { data } = useQueryAppliedCourses();
  const { data: tracks } = useQueryTracks();
  const { trackVisibility, setTrackVisibility } = useContext(TrackVisibilityContext);

  useEffect(() => {
    if (tracks) {
      initialStorageTrackVisibility(tracks);
      setTrackVisibility(getStorageTrackVisibility());
    }
  }, [tracks, setTrackVisibility]);

  function handleTrackVisibility(id: number, visibility: boolean) {
    updateStorageTrackVisibility(id, visibility);
    setTrackVisibility(getStorageTrackVisibility());
  }

  const activeCourses = useMemo(() => {
    if (!data) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return data.filter(ac => { const sd = new Date(ac.startDate); sd.setHours(0, 0, 0, 0); return sd <= today }).filter(ac => { const ed = new Date(ac.endDate!); ed.setHours(0, 0, 0, 0); return ed >= today });
  }, [data]);

  useMemo(() => {
    if (location.pathname.includes('/activecourses/details/') || location.pathname.includes('/activecourses/edit/')) {
      setBootcampIsActive(true);
    } else if (location.pathname === '/activecourses') {
      setBootcampIsActive(false);
    }
  }, [location.pathname]);

  const handleLogOut = () => {
    deleteCookie('id_token');
    deleteCookie("access_token");
    deleteCookie("auth_code");
    navigate("/login");
    window.location.reload();
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className={`fixed flex flex-col left-0 top-0 h-full bg-[#ff7961] text-white shadow-lg transition-all duration-200 ${isSidebarExpanded ? 'w-64' : 'w-20'}`}>

      <div className={`p-6 h-28 flex items-center overflow-hidden ${isSidebarExpanded ? 'justify-between' : 'pt-10 pb-10'}`}>
        <Link className={`flex flex-col text-xl ${isSidebarExpanded ? 'font-light' : 'font-bold'} text-white whitespace-nowrap`} to="/">
          {isSidebarExpanded && <img src="https://salt.dev/wp-content/uploads/2024/02/salt-logo-light.svg" alt="logo" />}
          {isSidebarExpanded ? "Course Planner" : "</>"}
        </Link>
        {isSidebarExpanded ?
          <button
            onClick={toggleSidebar}
            className="absolute right-[-25px] text-white text-3xl font-bold bg-primary-content p-2.5 mask mask-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          :
          <button
            onClick={toggleSidebar}
            className="absolute right-[-15px] text-white text-lg font-bold bg-primary-content p-1.5 mask mask-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        }
      </div>

      <ul className="menu menu-vertical text-center p-0 text-lg overflow-hidden">
        <li className="hover:rounded-none">
          <NavLink
            to={`/`}
            className={({ isActive }) => isActive ? "flex pl-6 text-xl bg-primary-content rounded-none" : "flex pl-6 text-xl rounded-none"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            {isSidebarExpanded && "Home"}
          </NavLink>
        </li>
        <li className="hover:rounded-none">
          <NavLink
            to={`/calendar/month/monthyear=${currentMonth}-${currentYear}`}
            className={({ isActive }) => isActive ? "flex pl-6 text-xl bg-primary-content rounded-none" : "flex pl-6 text-xl rounded-none"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
            {isSidebarExpanded && "Calendar"}
          </NavLink>
        </li>
        <li className="hover:rounded-none">
          <NavLink
            to="/activecourses"
            className={({ isActive }) => isActive && !bootcampIsActive ? "flex pl-6 text-xl bg-primary-content rounded-none" : "flex pl-6 text-xl rounded-none"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            {isSidebarExpanded && "Bootcamps"}
          </NavLink>
        </li>
        <li className="hover:rounded-none">
          <NavLink
            to="/events"
            onClick={(e) => e.preventDefault()}
            className={({ isActive }) => isActive ? "flex pl-6 text-xl bg-primary-content rounded-none" : "flex pl-6 text-xl rounded-none"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
            {isSidebarExpanded && "Events"}
          </NavLink>
        </li>

        <h2 className={`pt-6 pr-2 pb-3 pl-6 font-semibold text-xl text-left whitespace-nowrap ${isSidebarExpanded ? "" : "invisible"}`}>Active Bootcamps</h2>
        {activeCourses.map((course) => (
          <li className="hover:rounded-none" key={course.id}>
            <NavLink
              to={`/activecourses/details/${course.id}`}
              className={({ isActive }) => isActive || (bootcampIsActive && (location.pathname.includes(`/activecourses/details/${course.id}`) || location.pathname.includes(`/activecourses/edit/${course.id}`))) ? "flex pl-6 text-xl bg-primary-content rounded-none" : "flex pl-6 text-xl rounded-none"}>
              <div className="p-2.5 m-1 mask rounded border-2 border-white" style={{ backgroundColor: course.color }}></div>
              {isSidebarExpanded && course.name}
            </NavLink>
          </li>
        ))}

        <h2 className={`pt-6 pr-2 pb-3 pl-6 font-semibold text-xl text-left whitespace-nowrap ${isSidebarExpanded ? "" : "invisible"}`}>Templates</h2>
        <li className="hover:rounded-none">
          <NavLink
            to="/modules"
            className={({ isActive }) => isActive ? "flex pl-6 text-xl bg-primary-content rounded-none" : "flex pl-6 text-xl rounded-none"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
            </svg>
            {isSidebarExpanded && "Modules"}
          </NavLink>
        </li>
        <li className="hover:rounded-none">
          <NavLink
            to="/courses"
            className={({ isActive }) => isActive ? "flex pl-6 text-xl bg-primary-content rounded-none" : "flex pl-6 text-xl rounded-none"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            {isSidebarExpanded && "Courses"}
          </NavLink>
        </li>
        <li className="hover:rounded-none">
          <NavLink
            to="/tracks"
            className={({ isActive }) => isActive ? "flex pl-6 text-xl bg-primary-content rounded-none" : "flex pl-6 text-xl rounded-none"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            {isSidebarExpanded && "Tracks"}
          </NavLink>
        </li>
      </ul>

      <div className="flex-grow"></div>

      <div className={`flex ${!isSidebarExpanded && "flex-col"} justify-center items-center gap-2`}>
        {trackVisibility.map(t => (
          <VisibilityButton key={t.id} id={t.id} color={t.color} visibility={t.visibility} handleTrackVisibility={handleTrackVisibility} />
        ))}
      </div>

      <div className="m-4 overflow-hidden">
        <button className={`btn btn-secondary min-h-10 h-10 w-full text-xl p-0 flex-nowrap ${isSidebarExpanded && "min-w-32"}`} onClick={handleLogOut}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          {isSidebarExpanded && "Log Out"}
        </button>
      </div>
    </div>
  );
}