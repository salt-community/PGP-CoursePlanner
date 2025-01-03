import React, { useState, useEffect, useRef } from "react";
import { addDays, subDays } from "date-fns";
import Page from "@components/Page";
import { Link } from "react-router-dom";
import { currentMonth, currentYear, currentWeek } from "@helpers/dateHelpers";
import TimeLineCourse from "../sections/TimeLineCourse";
import TimeLineXaxis from "../sections/TimeLineXaxis";
import { ZoomOutButton } from "../components/ZoomOutBtn";
import { ZoomInButton } from "../components/ZoomInBtn";
import { useQueryAppliedCourses } from "@api/appliedCourse/appliedCourseQueries";

export type Activity = {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
};

const width = [12, 16, 24, 32, 40, 48]; //56, 64, 80, 96

const HorizontalCalendar: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesArray, setActivitiesArray] = useState<Activity[][]>([]);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));
  const [widthIndex, setWidthIndex] = useState<number>(3);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: appliedCourses } = useQueryAppliedCourses();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (appliedCourses) {
      const newActivities: Activity[] = [];
      const newActivitiesArray: Activity[][] = [];
      appliedCourses.forEach(ac => {

        const newActivity: Activity = {
          id: ac.id!,
          title: ac.name,
          startDate: new Date(ac.startDate),
          endDate: new Date(ac.endDate!),
          color: ac.color!,
        };
        const sameTitleIndex = newActivitiesArray.findIndex(activities => activities.find(activity => activity.title == newActivity.title));
        if (sameTitleIndex != -1) {
          newActivitiesArray[sameTitleIndex].push(newActivity);
        } else {
          newActivitiesArray.push([newActivity]);
        }
        newActivities.push(newActivity);
      });

      let tempStartDate = startDate;
      let tempEndDate = endDate;
      newActivities.forEach(ac => {
        if (subDays(ac.startDate, 7) < tempStartDate)
          tempStartDate = subDays(ac.startDate, 7)
        if (addDays(ac.endDate!, 7) > tempEndDate)
          tempEndDate = addDays(ac.endDate!, 7)
      });
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);

      setActivities(newActivities);
      setActivitiesArray(newActivitiesArray);
    }
  }, [appliedCourses, endDate, startDate]
  );

  const numDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  const numDaysToday = Math.ceil((today.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;

  const dates: Date[] = [startDate];
  for (let i = 1; i < numDays + 1; i++)
    dates.push(addDays(startDate, i));

  let height = "80px";
  if (activitiesArray.length > 0)
    height = ((activitiesArray.length + 1) * 80) + "px";

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const clientWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollLeft = (scrollWidth - clientWidth) * (numDaysToday / numDays);
    }
  }, [activities, widthIndex, numDays, numDaysToday]);

  return (
    <Page>
      <div ref={scrollContainerRef} style={{ "height": height }} className="overflow-x-auto px-4 flex flex-col">
        <div className="flex flex-row">
          {activities.length > 0 &&
            <TimeLineXaxis dates={dates} width={width[widthIndex]}></TimeLineXaxis>
          }

        </div>
        {activitiesArray.length > 0 &&
          <>
            {activitiesArray.map((courses, index) => {
              return (
                <div key={index} className="flex flex-row"><TimeLineCourse dates={dates} courses={courses} width={width[widthIndex]}></TimeLineCourse></div>)
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
          <ZoomOutButton onClick={() => setWidthIndex(widthIndex - 1)} disabled={widthIndex === 0} />
          <ZoomInButton onClick={() => setWidthIndex(widthIndex + 1)} disabled={widthIndex === width.length - 1} />
        </div>
      </div>
    </Page >
  );
};

export default HorizontalCalendar;