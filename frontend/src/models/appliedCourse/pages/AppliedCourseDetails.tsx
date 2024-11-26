import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useEffect, useState } from "react";
import { deleteAppliedCourse, getAppliedCourseById } from "@api/AppliedCourseApi";
import 'reactjs-popup/dist/index.css';
import { getCookie } from "@helpers/cookieHelpers";
import Login from "@models/login/Login";
import { AppliedCourseType } from "@models/course/Types";
import { Link, useNavigate } from "react-router-dom";
import DeleteBtn from "@components/buttons/DeleteBtn";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PDFWeekGenerator from "../sections/PDFWeekGenerator";
import PDFGenerator from "../sections/PDFGenerator";
import { trackUrl } from "@helpers/helperMethods";
import { getModulesByCourseId } from "@api/CourseModulesApi";
import { ModuleType } from "@models/module/Types";

export default function AppliedCourseDetails() {
    trackUrl();

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [appliedCourseName, setAppliedCourseName] = useState<string>("");
    //const [appliedModules, setAppliedModules] = useState<AppliedModuleType[]>();

    const navigate = useNavigate();

    const appliedCourseId = useIdFromPath();
    const [appliedCourse, setAppliedCourse] = useState<AppliedCourseType>();
    useEffect(() => {
        getAppliedCourseById(parseInt(appliedCourseId))
            .then(result => { setAppliedCourse(result); setStartDate(new Date(result!.startDate!)); setEndDate(new Date(result!.endDate!)); setAppliedCourseName(result!.name!);  })
    }, [appliedCourseId]);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number) => {
            return deleteAppliedCourse(id);
        },
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ['allAppliedCourses', id] })
            navigate(`/activecourses`);
        }
    })

    function getWeekDayList() {
        const days = []
        const end = new Date(endDate)
        for (let start = new Date(startDate); start <= end; start.setDate(start.getDate() + 1)) {
            const day = start.getDay();
            if (day != 6 && day != 0) {
                days.push(new Date(start));
            }
        }
        days.push(endDate)
        return days;
    }

    const { isPending, data : appliedModules, isError : isAppliedModulesError, error : AppliedModulesError } = useQuery<ModuleType[]>({
        queryKey: ['AppliedModules', appliedCourseId],
        queryFn: () => getModulesByCourseId(Number(appliedCourseId)),
      })

    const courseWeekDates = getWeekDayList();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthNamesShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const courseWeekDays = courseWeekDates.map(e =>  monthNamesShort[e.getMonth()] + " " + e.getDate().toString());

    let counter = -1;

    console.log(appliedModules);
    if(isPending) return <p>pending</p>;
    if(isAppliedModulesError){
        console.log(AppliedModulesError)
        return <p>Error</p>
    };
    return (
        getCookie("access_token") == undefined
            ? <Login />
            : <Page>
                {appliedCourse &&
                    <>
                        <section className="mx-auto flex flex-col gap-4 px-4 md:px-24 lg:px-56">
                            <section className="flex items-center flex-col gap-4">
                                <h1 className="text-xl text-primary font-bold mb-2">{appliedCourseName} ({new Date(startDate).getDate()} {monthNames[new Date(startDate).getMonth()]} {new Date(startDate).getFullYear()} - {new Date(endDate!).getDate()} {monthNames[new Date(endDate!).getMonth()]} {new Date(endDate!).getFullYear()})</h1>
                                <h2 className=" text-lg flex items-center">Calendar color:
                                    <div style={{ backgroundColor: appliedCourse.color }} className="w-5 h-5 ml-2"></div>
                                </h2>
                            </section>
                            <section className="flex items-start flex-col gap-4 px-1 sm:p-0 md:px-24">
                                {appliedModules!.map((module, index) =>
                                    <div key={index}>
                                        <h1 className="text-lg font-bold self-start">
                                            Module {index + 1}: {module.name}
                                        </h1>
                                        {module.days.map((day, index) => {
                                            counter++;
                                            return (
                                                <div key={index} className="w-full">
                                                    {day.events.length > 0
                                                        ? <div className="collapse w-full">
                                                            <input type="checkbox" id={`collapse-toggle-events-${day.dayNumber}-${module.id}`} className="hidden" />
                                                            <div className="collapse-title text-base flex justify-between items-center">
                                                                <h2 className="flex items-center min-w-14 align-bottom">Day {day.dayNumber} ({courseWeekDays[counter]}): {day.description}</h2>
                                                                <label htmlFor={`collapse-toggle-events-${day.dayNumber}-${module.id}`} className="cursor-pointer flex flex-row">
                                                                    <h6 className='text-xs hover:italic'>Events</h6>
                                                                    <svg className="fill-current w-4 h-4 transform rotate-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                                        <path d="M15.3 9.3l-3.3 3.3-3.3-3.3-1.4 1.4 4.7 4.7 4.7-4.7z" />
                                                                    </svg>
                                                                </label>
                                                            </div>
                                                            <div className="collapse-content w-full">
                                                                <table className="table table-sm table-fixed">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="w-2/12">Event name</th>
                                                                            <th className="w-6/12">Description</th>
                                                                            <th className="w-2/12">Start</th>
                                                                            <th className="w-2/12">End</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {day.events.map((event) => (
                                                                            <tr key={event.name} className="gap-2">
                                                                                <td>{event.name}</td>
                                                                                <td>{event.description}</td>
                                                                                <td>{event.startTime}</td>
                                                                                <td>{event.endTime}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        : <div className="collapse w-full">
                                                            <input type="checkbox" id={`collapse-toggle-events-${day.dayNumber}-${module.id}`} className="hidden" />
                                                            <div className="collapse-title text-base flex justify-between items-center">
                                                                <h2 className="flex items-center min-w-14 align-bottom">Day {day.dayNumber}: {day.description}</h2>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        }
                                        )}
                                    </div>
                                )}
                            </section>
                            <div className="flex flex-row gap-2 px-1 mb-6 sm:p-0 md:px-24">
                                <Link to={`/activecourses/edit/${appliedCourse.id}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit</Link>
                                <DeleteBtn onClick={() => mutation.mutate(parseInt(appliedCourse.id!.toString()))}>Delete</DeleteBtn>
                                <PDFGenerator appliedCourse={appliedCourse} courseWeekDays={courseWeekDays} appliedModules={appliedModules}></PDFGenerator>
                                <PDFWeekGenerator appliedCourse={appliedCourse} courseWeekDays={courseWeekDays } appliedModules={appliedModules}></PDFWeekGenerator>
                            </div>
                        </section>
                    </>
                }
            </Page >
    )
}