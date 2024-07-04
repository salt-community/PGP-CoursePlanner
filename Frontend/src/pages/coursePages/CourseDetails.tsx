import { Link, useNavigate } from "react-router-dom";
import { deleteCourse, getCourseById } from "../../api/CourseApi";
import Page from "../../sections/Page";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getIdFromPath } from "../../helpers/helperMethods";
import { ModuleType } from "../../sections/module/Types";
import { getAllModules } from "../../api/ModuleApi";
import { useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { postAppliedCourse } from "../../api/AppliedCourseApi";
import { AppliedCourseType } from "../../sections/course/Types";
import { convertToGoogle } from "../../helpers/googleHelpers";

export default function CourseDetails() {
    const [startDate, setStartDate] = useState<Date>(new Date());

    const navigate = useNavigate();

    const courseId = getIdFromPath();

    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['courses', courseId],
        queryFn: () => getCourseById(parseInt(courseId))
    });

    const { data: allModules } = useQuery({
        queryKey: ['modules'],
        queryFn: () => getAllModules()
    });

    var modules: ModuleType[] = [];
    course?.moduleIds.forEach(element => {
        var module = allModules?.find(m => m.id == element);
        modules.push(module!)
    });

    const handleApplyTemplate = () => {
        const appliedCourse: AppliedCourseType = {
            startDate: startDate,
            courseId: parseInt(courseId)
        };
        postAppliedCourse(appliedCourse);
        navigate('/calendar/month')
    }

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => {
            return deleteCourse(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            navigate(`/courses`);
        }
    })

    return (
        <Page>
            {isLoading && <p>Loading...</p>}
            {isError && <p>An error occured</p>}
            {course &&
                <section className="mx-auto flex flex-col gap-4 px-4 md:px-24 lg:px-56">
                    <div className="">
                        <section className="flex items-center flex-col gap-4 px-1 sm:p-0">
                            <h1 className="pb-4 text-xl text-primary font-bold">{course.name}</h1>
                            {modules.map((module, index) =>
                                <div key={module.id}>
                                    <h1 className="text-lg text-black font-bold self-start">
                                        <Link to={`/modules/details/${module.id}`}>
                                            Module {index + 1}: {module.name}
                                        </Link>
                                    </h1>
                                    <table className="table table-fixed table-sm lg:table-lg" key={"module_" + index}>
                                        <thead>
                                            <tr>
                                                <th className="text-sm w-1/6">Day</th>
                                                <th className="text-sm w-1/6">Events</th>
                                                <th className="text-sm w-2/3">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {module.days.map((day, dayIndex) =>
                                                <tr key={dayIndex}>
                                                    <td className="text-sm">{day.dayNumber}</td>
                                                    <td className="text-sm">{day.events.length}</td>
                                                    <td className="text-sm">{day.description}</td>
                                                </tr>
                                            )}
                                            <tr></tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </section>
                    </div>

                    <label htmlFor="startDate" className="font-bold text-[var(--fallback-bc,oklch(var(--bc)/0.6))] text-sm">Enter Start Date: </label>
                    <DatePicker name="startDate" value={startDate} onChange={(date) => setStartDate(date!)} className="max-w-xs" sx={
                        {
                            height: "35px",
                            padding: "0px",
                            "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                                fontFamily: 'Montserrat',
                                color: "var(--fallback-bc,oklch(var(--bc)/0.7))",
                                padding: "6px"
                            }
                        }
                    } />
                    <div className="pt-4 flex gap-4 flex-col sm:flex-row">
                        <button onClick={() => mutation.mutate(parseInt(courseId))} className="btn btn-sm py-1 max-w-xs btn-error text-white">Delete Course</button>
                        <Link to={`/courses/edit/${courseId}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit Course</Link>
                        <button onClick={handleApplyTemplate} className="btn btn-sm py-1 max-w-xs btn-success text-white">Save Course </button>
                        <button onClick={() => convertToGoogle(modules, startDate, course.name)} className="btn btn-sm py-1 max-w-xs btn-success text-white">Add to google calendar </button>
                    </div>
                </section >
            }
        </Page >
    )
}