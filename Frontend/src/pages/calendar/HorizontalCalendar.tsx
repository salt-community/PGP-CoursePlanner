import React, { useState, useEffect } from "react";
import { addDays, subDays, getWeek } from "date-fns"; // Import date-fns for date manipulation
import Page from "../../sections/Page";
import { useQuery } from "react-query";
import { getAllAppliedCourses } from "../../api/AppliedCourseApi";
import TimeLineXaxis from "../../components/calendar/TimeLineXaxis";
import TimeLineCourse from "../../components/calendar/TimeLineCourse";
import { getAllCourses } from "../../api/CourseApi";
import { getAllModules } from "../../api/ModuleApi";
import { currentMonth, firstDayOfMonth } from "../../helpers/dateHelpers";
import { Link } from "react-router-dom";

export type Activity = {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
};

const HorizontalCalendar: React.FC = () => {
  const { data: appliedCourses, isLoading, isError } = useQuery({
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

  const [activities, setActivities] = useState<Activity[]>([]);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 21)); 
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 21)); 

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
      });
      setActivities(newActivities);
    }
  }, [appliedCourses, courses, modules]
  );
  console.log(activities[0])

  // Calculate the maximum number of days to display
  const numDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  var dates: Date[] = [startDate];
  for (var i = 1; i < numDays + 1; i++)
    dates.push(addDays(startDate, i));

  var height = "80px";
  if (activities.length > 0)
    height = ((activities.length + 1) * 80) + "px";

  return (
    <Page>
      <div style={{ "height": height }} className="overflow-x-auto px-4">
        <div className="flex flex-col">
          <div className="flex flex-row">

            {activities.length > 0 &&
              <TimeLineXaxis dates={dates}></TimeLineXaxis>
            }

          </div>
          {activities.length > 0 &&
            <>
              {activities.map(course => {
                return (
                  <div className="flex flex-row"><TimeLineCourse dates={dates} course={course}></TimeLineCourse></div>)
              })}
            </>
          }
        </div>
      </div >
      <div className="border-b-2 border-gray-100"></div>
      <div className="flex flex-row justify-center gap-2">
        <Link to={`/calendar/week/weeknumber=${getWeek(firstDayOfMonth(currentMonth))}`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to week view</Link>
        <Link to={`/calendar/month`} className="btn btn-sm py-1 mt-4 max-w-xs btn-info text-white">Go to month view</Link>
      </div>
    </Page >
  );
};

export default HorizontalCalendar;
