import React, { useState, useEffect, act } from "react";
import { format, addDays, subDays } from "date-fns"; // Import date-fns for date manipulation
import Page from "../../sections/Page";
import { useQuery } from "react-query";
import { getAllAppliedCourses } from "../../api/AppliedCourseApi";
import TimeLineXaxis from "../../components/calendar/TimeLineXaxis";
import TimeLineCourse from "../../components/calendar/TimeLineCourse";

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

  const [activities, setActivities] = useState<Activity[]>([]);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 21)); // Start 14 days ago
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 21)); // End 14 days ahead

  useEffect(() => {
    if (appliedCourses) {
      const newActivities: Activity[] = appliedCourses.map((course) => ({
        id: course.id!,
        title: course.courseId!.toString(),
        startDate: new Date(course.startDate),
        endDate: addDays(new Date(course.startDate), 5),
        color: course.color,
      }));
      setActivities(newActivities);
    }
  }, [appliedCourses]);
  console.log(appliedCourses)

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
        {/* Date headers */}
        <div className="flex flex-col">
          <div className="flex flex-row">

            {activities.length > 0 &&
              <TimeLineXaxis dates={dates}></TimeLineXaxis>
            }

          </div>
          {/* <div className="flex flex-row w-full" > */}
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
    </Page >
  );
};

export default HorizontalCalendar;
