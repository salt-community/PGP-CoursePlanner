import { useMutation, useQuery, useQueryClient } from "react-query";
import Page from "../../../components/Page";
import { deleteAppliedCourse, getAllAppliedCourses } from "../../../api/AppliedCourseApi";
import DeleteBtn from "../../../components/buttons/DeleteBtn";
import { Link, useNavigate } from "react-router-dom";
import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import { getCookie } from "../../../helpers/cookieHelpers";
import NavigateToLogin from "../../login/NavigateToLogin";

export default function AppliedCourses() {
    const navigate = useNavigate();

    const { data: allAppliedCourses, isLoading, isError } = useQuery({
        queryKey: ['allAppliedCourses'],
        queryFn: getAllAppliedCourses
    });
    console.log(allAppliedCourses);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number) => {
            return deleteAppliedCourse(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allAppliedCourses'] })
            navigate(`/activecourses`);
        }
    })

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        getCookie("access_token") == undefined ?
            <NavigateToLogin />
            :
            <Page>
                <section className="px-4 md:px-24 lg:px-56">
                    {isLoading && <LoadingMessage />}
                    {isError && <ErrorMessage />}
                    {allAppliedCourses && allAppliedCourses?.length > 0
                        ? <>
                            {allAppliedCourses && allAppliedCourses.map((appliedCourse) =>
                                <>
                                    <div className="collapse border-primary border mb-2">
                                        <input type="checkbox" id={`collapse-toggle-${appliedCourse.id}`} className="hidden" />
                                        <div className="collapse-title flex flex-col w-full gap-4">
                                            <h1 className="text-xl font-bold mb-2 text-primary">{appliedCourse.name} ({new Date(appliedCourse.startDate).getDate()} {monthNames[new Date(appliedCourse.startDate).getMonth()]} {new Date(appliedCourse.startDate).getFullYear()} - {new Date(appliedCourse.endDate!).getDate()} {monthNames[new Date(appliedCourse.endDate!).getMonth()]} {new Date(appliedCourse.endDate!).getFullYear()})</h1>
                                            <div className="flex flex-row">
                                                <div className=" flex flex-row w-1/2">
                                                    <h2 className=" text-lg flex items-center">Calendar color:
                                                        <div style={{ backgroundColor: appliedCourse.color }} className="w-5 h-5 ml-2"></div>
                                                    </h2>
                                                </div>
                                                <div className="w-1/2 flex flex-row items-end justify-end gap-12">
                                                    <div className="flex flex-row gap-1">
                                                        <Link to={`/activecourses/edit/${appliedCourse.id}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit</Link>
                                                        <DeleteBtn onClick={() => mutation.mutate(parseInt(appliedCourse.id!.toString()))}>Delete</DeleteBtn>
                                                    </div>
                                                    <label htmlFor={`collapse-toggle-${appliedCourse.id}`} className="cursor-pointer flex flex-row items-end">
                                                        <h1 className="text-lg item-end justify-item-end">
                                                            Details
                                                        </h1>
                                                        <svg className="fill-current w-7 h-7 transform rotate-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                            <path d="M15.3 9.3l-3.3 3.3-3.3-3.3-1.4 1.4 4.7 4.7 4.7-4.7z" />
                                                        </svg>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="collapse-content w-full">
                                            <div className="w-full border border-gray-200 mb-4"></div>
                                            <section className="flex items-start flex-col gap-4 px-1 sm:p-0 md:px-24">

                                                {appliedCourse.modules!.map((module, index) =>
                                                    <div key={module.id}>
                                                        <h1 className="text-lg text-black font-bold self-start">
                                                            Module {index + 1}: {module.name}
                                                        </h1>

                                                        {module.days.map((day, dayIndex) =>
                                                            <div className="w-full">
                                                                {day.events.length > 0
                                                                    ? <div className="collapse w-full">
                                                                        <input type="checkbox" id={`collapse-toggle-events-${day.dayNumber}-${module.id}`} className="hidden" />
                                                                        <div className="collapse-title text-base flex justify-between items-center">
                                                                            <h2 className="flex items-center min-w-14 align-bottom">Day {day.dayNumber}: {day.description}</h2>
                                                                            <label htmlFor={`collapse-toggle-events-${day.dayNumber}-${module.id}`} className="cursor-pointer flex flex-row">
                                                                                <h6 className='text-xs'>Events</h6>
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
                                                                                    {day.events.map((event, index) => (
                                                                                        <tr className="gap-2">
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
                                                        )}
                                                    </div>
                                                )}
                                            </section>

                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                        : <div className="text-xl">There are currently no active courses in the calendar</div>}
                </section>
            </Page>
    )
}