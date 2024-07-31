import React, { useState, useEffect } from "react";
import { addDays, subDays, getWeek } from "date-fns"; // Import date-fns for date manipulation
import Page from "../../../components/Page";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getAllAppliedCourses } from "../../../api/AppliedCourseApi";
import { getAllCourses } from "../../../api/CourseApi";
import { getAllModules } from "../../../api/ModuleApi";
import { firstDayOfMonth, currentMonth } from "../../../helpers/dateHelpers";
import TimeLineCourse from "../sections/TimeLineCourse";
import TimeLineXaxis from "../sections/TimeLineXaxis";
import { getCookie } from "../../../helpers/cookieHelpers";
import NavigateToLogin from "../../login/NavigateToLogin";
import Login from "../../login/Login";

export type Activity = {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
};

const HorizontalCalendar: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));

  var width = [16, 24, 32, 40, 48, 56, 64, 80, 96];
  const [widthIndex, setWidthIndex] = useState<number>(3);

  const { data: appliedCourses } = useQuery({
    queryKey: ["appliedCourses"],
    queryFn: getAllAppliedCourses,
  });

  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  const { data: modules } = useQuery({
    queryKey: ["modules"],
    queryFn: getAllModules,
  });

  useEffect(() => {
    if (appliedCourses && courses && modules) {
      const newActivities: Activity[] = [];
      appliedCourses.forEach(ac => {
        var c = courses?.find(c => c.id == ac.courseId)!;

        var newActivity: Activity = {
          id: ac.id!,
          title: c.name,
          startDate: new Date(ac.startDate),
          endDate: new Date(ac.endDate!),
          color: ac.color,
        };
        newActivities.push(newActivity);

        if (subDays(ac.startDate, 7) < startDate)
          setStartDate(subDays(ac.startDate, 7));
        if (addDays(ac.endDate!, 7) > endDate)
          setEndDate(addDays(ac.endDate!, 7))
      });
      setActivities(newActivities);
    }
  }, [appliedCourses, courses, modules]
  );

  // Calculate the maximum number of days to display
  const numDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  var dates: Date[] = [startDate];
  for (var i = 1; i < numDays + 1; i++)
    dates.push(addDays(startDate, i));

  var height = "80px";
  if (activities.length > 0)
    height = ((activities.length + 1) * 80) + "px";

  return (
    getCookie("access_token") == undefined ?
      <Login />
      :
      <Page>
        <div style={{ "height": height }} className="overflow-x-auto px-4 flex flex-col">
          {/* <div className="flex flex-col"> */}
          <div className="flex flex-row">

            {activities.length > 0 &&
              <TimeLineXaxis dates={dates} width={width[widthIndex]}></TimeLineXaxis>
            }

          </div>
          {activities.length > 0 &&
            <>
              {activities.map(course => {
                return (
                  <div className="flex flex-row"><TimeLineCourse dates={dates} course={course} width={width[widthIndex]}></TimeLineCourse></div>)
              })}
            </>
          }
          {/* </div> */}
        </div >
        <div className="border-b-2 border-gray-100"></div>
        <div className="ml-10 mr-10 flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <Link to={`/calendar/week/weeknumber=${getWeek(firstDayOfMonth(currentMonth))}`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to week view</Link>
            <Link to={`/calendar/month`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to month view</Link>
          </div>
          <div className="flex flex-row gap-2">
            {widthIndex != 0
              ? <svg onClick={() => setWidthIndex(widthIndex - 1)} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
              </svg>
              : <svg className="btn btn-sm py-1 mt-4 max-w-xs btn-disabled" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-6" />
              </svg>}
            {widthIndex != width.length - 1
              ? <svg onClick={() => setWidthIndex(widthIndex + 1)} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
              </svg>
              : <svg className="btn btn-sm py-1 mt-4 max-w-xs btn-disabled" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
              </svg>}
          </div>
        </div>
      </Page >
  );
};



export default HorizontalCalendar;
