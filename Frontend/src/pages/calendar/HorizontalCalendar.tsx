import React, { useState, useEffect, act } from "react";
import { format, addDays, subDays } from "date-fns"; // Import date-fns for date manipulation
import Page from "../../sections/Page";
import { useQuery } from "react-query";
import { getAllAppliedCourses } from "../../api/AppliedCourseApi";
import TimeLineXaxis from "../../components/calendar/TimeLineXaxis";
import TimeLineCourse from "../../components/calendar/TimeLineCourse";
import { getAllCourses } from "../../api/CourseApi";
import { getAllModules } from "../../api/ModuleApi";

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
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 21)); // Start 14 days ago
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 21)); // End 14 days ahead

  useEffect(() => {
    if (appliedCourses) {
      const newActivities: Activity[] = [];
      appliedCourses.forEach(ac => {
        var c = courses?.find(c => c.id == ac.courseId)!;
        var modIds = c.moduleIds!;
        var totalDays = 0;
        modIds.forEach(mId => {
          var m = modules?.find(m => m.id == mId)!;
          totalDays = totalDays + m.numberOfDays;
        });
        var endDate = new Date(ac.startDate);
        var currentDate = new Date(ac.startDate);
        for (i = 0; i < totalDays; i++) {
          var endDate = currentDate;
          if (currentDate.getDay() == 5)
            currentDate = addDays(currentDate, 3)
          else
            currentDate = addDays(currentDate, 1)
        }

        var newActivity: Activity = {
          id: ac.id!,
          title: c.name,
          startDate: new Date(ac.startDate),
          endDate: endDate,
          color: ac.color,
        };
        newActivities.push(newActivity);
      });
      setActivities(newActivities);
    }
  }, [appliedCourses]
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
    </Page >
  );
};

export default HorizontalCalendar;
