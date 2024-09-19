import React, { useState, useEffect, useRef } from "react";
import { addDays, subDays } from "date-fns";
import Page from "../../../components/Page";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllAppliedCourses } from "../../../api/AppliedCourseApi";
import { getAllCourses } from "../../../api/CourseApi";
import { getAllModules } from "../../../api/ModuleApi";
import { currentMonth, currentYear, currentWeek } from "../../../helpers/dateHelpers";
import TimeLineCourse from "../sections/TimeLineCourse";
import TimeLineXaxis from "../sections/TimeLineXaxis";
import { getCookie } from "../../../helpers/cookieHelpers";
import Login from "../../login/Login";

export type Activity = {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
  courseId: number;
};

const HorizontalCalendar: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesArray, setActivitiesArray] = useState<Activity[][]>([]);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  var width = [12, 16, 24, 32, 40, 48]; //56, 64, 80, 96
  const [widthIndex, setWidthIndex] = useState<number>(3);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
          courseId: ac.courseId
        };
        newActivities.push(newActivity);
      });

      // // sort calendar by active/future/past bootcamps
      // const activeActivities: Activity[] = newActivities.filter(ac => { var sd = new Date(ac.startDate); sd.setHours(0, 0, 0, 0); return sd <= today }).filter(ac => { var ed = new Date(ac.endDate!); ed.setHours(0, 0, 0, 0); return ed >= today });
      // const futureActivities: Activity[] =newActivities.filter(ac => { var sd = new Date(ac.startDate); sd.setHours(0, 0, 0, 0); return sd > today });
      // const pastActivities: Activity[] = newActivities.filter(ac => { var ed = new Date(ac.endDate!); ed.setHours(0, 0, 0, 0); return ed < today });

      // const sortActivities = (activities: Activity[]): Activity[] => {
      //   return activities.sort((a, b) => {
      //     const startDateA = new Date(a.startDate!);
      //     const startDateB = new Date(b.startDate!);
      //     const endDateA = new Date(a.endDate!);
      //     const endDateB = new Date(b.endDate!);
  
      //     if (startDateA < startDateB) return -1;
      //     if (startDateA > startDateB) return 1;
      //     if (endDateA < endDateB) return -1;
      //     if (endDateA > endDateB) return 1;
      //     return 0;
      //   });
      // };
  
      // const sortedActiveActivities = sortActivities(activeActivities);
      // const sortedFutureActivities = sortActivities(futureActivities);
      // const sortedPastActivities = sortActivities(pastActivities);
      // const sortedActivities: Activity[] = [...sortedActiveActivities, ...sortedFutureActivities, ...sortedPastActivities]

      // sort calendar by bootcamp
      const oneActivities: Activity[] = newActivities.filter(ac => ac.courseId == 1);
      const twoActivities: Activity[] = newActivities.filter(ac => ac.courseId == 2);
      const threeActivities: Activity[] = newActivities.filter(ac => ac.courseId == 3);

      const sortedActivities = [oneActivities, twoActivities, threeActivities]

      var tempStartDate = startDate;
      var tempEndDate = endDate;
      newActivities.forEach(ac => {
        if (subDays(ac.startDate, 7) < tempStartDate)
          tempStartDate = subDays(ac.startDate, 7)
        if (addDays(ac.endDate!, 7) > tempEndDate)
          tempEndDate = addDays(ac.endDate!, 7)
      });
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);

      setActivities(newActivities);
      setActivitiesArray(sortedActivities);
    }
  }, [appliedCourses, courses, modules]
  );

  const numDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  const numDaysToday = Math.ceil((today.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;

  var dates: Date[] = [startDate];
  for (var i = 1; i < numDays + 1; i++)
    dates.push(addDays(startDate, i));

  var height = "80px";
  if (activitiesArray.length > 0)
    height = ((activitiesArray.length + 1) * 80) + "px";

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const clientWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollLeft = (scrollWidth - clientWidth) * (numDaysToday / numDays);
    }
  }, [activities, widthIndex]);

  return (
    getCookie("access_token") == undefined ?
      <Login />
      :
      <Page>
        <div ref={scrollContainerRef}  style={{ "height": height }} className="overflow-x-auto px-4 flex flex-col">
          <div className="flex flex-row">
            {activities.length > 0 &&
              <TimeLineXaxis dates={dates} width={width[widthIndex]}></TimeLineXaxis>
            }

          </div>
          {activitiesArray.length > 0 &&
            <>
              {activitiesArray.map(courses => {
                return (
                  <div className="flex flex-row"><TimeLineCourse dates={dates} courses={courses} width={width[widthIndex]}></TimeLineCourse></div>)
              })}
            </>
          }
        </div >
        <div className="border-b-2 border-gray-100"></div>
        <div className="ml-10 mr-10 flex flex-row justify-between">
          <div className="flex flex-row gap-2">
            <Link to={`/calendar/week/weeknumberyear=${currentWeek}-${currentYear}`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to week view</Link>
            <Link to={`/calendar/month/monthyear=${currentMonth}-${currentYear}`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to month view</Link>
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
