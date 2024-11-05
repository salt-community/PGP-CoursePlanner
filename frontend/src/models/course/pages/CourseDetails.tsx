import { Link, useNavigate } from "react-router-dom";
import { deleteCourse, getCourseById } from "../../../api/CourseApi";
import Page from "../../../components/Page";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getIdFromPath, trackUrl } from "../../../helpers/helperMethods";
import { getAllModules } from "../../../api/ModuleApi";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { editAppliedCourse, getAllAppliedCourses, postAppliedCourse } from "../../../api/AppliedCourseApi";
import { convertToGoogle } from "../../../helpers/googleHelpers";
import DeleteBtn from "../../../components/buttons/DeleteBtn";
import { deleteCourseFromGoogle } from "../../../api/GoogleCalendarApi";
import ColorSelection from "../../../components/ColorSelection";
import ColorBtn from "../../../components/buttons/ColorButton";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import CloseBtn from "../../../components/buttons/CloseBtn";
import { ModuleType } from "../../module/Types";
import { AppliedCourseType } from "../Types";
import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import { getCookie } from "../../../helpers/cookieHelpers";
import Login from "../../login/Login";

export default function CourseDetails() {
    trackUrl();

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);
    const [isOpened, setIsOpened] = useState<boolean>(false);

    const navigate = useNavigate();

    const courseId = getIdFromPath();
    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['courses', courseId],
        queryFn: () => getCourseById(parseInt(courseId))
    });

    const { data: allModules, isLoading: isLoadingModules, isError: isErrorModules } = useQuery({
        queryKey: ['modules'],
        queryFn: () => getAllModules()
    });

    const { data: allAppliedCourses, isLoading: isLoadingAppliedCourses, isError: isErrorAppliedCourses } = useQuery({
        queryKey: ['appliedCourses'],
        queryFn: () => getAllAppliedCourses()
    });
    const usedCourses: number[] = [];
    if (allAppliedCourses) {
        allAppliedCourses.forEach(element => {
            usedCourses.push(element.courseId);
        });
    }

    const popupRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpened(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const modules: ModuleType[] = [];
    course?.moduleIds.forEach(element => {
        const module = allModules?.find(m => m.id == element);
        modules.push(module!)
    });

    let defaultColor = "#FFFFFF";
    const [color, setColor] = useState(defaultColor);
    const [isColorNotSelected, setIsColorNotSelected] = useState<boolean>(false);
    useEffect(() => {
        if (course && allAppliedCourses) {
            const appliedCoursesWithCourseId = allAppliedCourses.filter(m => m.courseId! === course.id);
            
            if (appliedCoursesWithCourseId.length > 0) {
                defaultColor = appliedCoursesWithCourseId[0].color;
                setColor(defaultColor)
            }
        }
    }, [course, allAppliedCourses]);

    const handleApplyTemplate = async () => {
        setIsColorNotSelected(false);
        setIsInvalidDate(false);
        if (color == "#FFFFFF" || startDate.getDay() == 6 || startDate.getDay() == 0) {
            if (color == "#FFFFFF")
                setIsColorNotSelected(true);
            if (startDate.getDay() == 6 || startDate.getDay() == 0)
                setIsInvalidDate(true);
        }
        else {
            const appliedCoursesWithCourseId = allAppliedCourses!.filter(m => m.courseId! == course!.id);
            if (appliedCoursesWithCourseId.length > 0 && color != defaultColor) {
                await Promise.all(appliedCoursesWithCourseId!.map(async appliedCourse => {
                    try {
                        const newAppliedCourse: AppliedCourseType = {
                            id: appliedCourse.id,
                            name: appliedCourse.name,
                            startDate: appliedCourse.startDate,
                            endDate: appliedCourse.endDate,
                            courseId: appliedCourse.courseId,
                            modules: appliedCourse.modules,
                            color: color
                        };
                        await editAppliedCourse(newAppliedCourse);
                    } catch (error) {
                        console.error("Error posting applied event:", error);
                    }
                }));
            }

            const appliedCourse: AppliedCourseType = {
                name: course?.name!,
                startDate: startDate,
                courseId: parseInt(courseId),
                color: color
            };
            const response = postAppliedCourse(appliedCourse);
            if ((await response) != undefined && (await response)!.ok) {
                navigate('/activecourses')
            }
        }
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
        getCookie("access_token") == undefined
            ? <Login />
            : <Page>
                {(isLoading || isLoadingModules || isLoadingAppliedCourses) && <LoadingMessage />}
                {(isError || isErrorModules || isErrorAppliedCourses) && <ErrorMessage />}
                {course && allAppliedCourses &&
                    <section className="mx-auto flex flex-col gap-4 px-4 md:px-24 lg:px-56">
                        <section className="flex items-center flex-col gap-4 px-1 sm:p-0">
                            <h1 className="pb-4 text-xl text-primary font-bold">{course.name}</h1>
                            {modules && modules.map((module, index) =>
                                <div key={module.id}>
                                    <h1 className="text-lg text-black font-bold self-start">
                                        <Link to={`/modules/details/${module.id}`} className="hover:italic">
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

                        <div className="pt-4 flex gap-4 flex-col sm:flex-row">
                            <Link to={`/courses/edit/${courseId}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit Course</Link>
                            <DeleteBtn onClick={() => mutation.mutate(parseInt(courseId))} >Delete Course</DeleteBtn>
                        </div>
                        <p className="error-message text-red-600 text-sm hidden" id="invalid-module-delete">Cannot delete this course, it is used in the calendar!</p>
                        <div className="flex gap-4 mt-10">
                            <div className="self-start mt-2">
                                <h1 className="font-bold text-black] text-sm">Enter start date: </h1>
                            </div>
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

                            <Popup
                                open={isOpened}
                                onOpen={() => setIsOpened(true)}
                                trigger={<ColorBtn color={color}>Select color</ColorBtn>}
                                modal
                            >
                                {
                                    <div ref={popupRef}>

                                        <div className="flex flex-col">
                                            <div className="flex justify-end">
                                                <CloseBtn onClick={() => setIsOpened(false)} />
                                            </div>
                                            <div className="self-center mt-2 mb-4">
                                                <ColorSelection color={color} setColor={setColor}></ColorSelection>
                                            </div>
                                            <div className="self-center mb-4">
                                                <ColorBtn onClick={() => setIsOpened(false)} color={color}>Select color</ColorBtn>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Popup>

                        </div>
                        {isColorNotSelected &&
                            <p className="error-message text-red-600 text-sm" id="invalid-helper">Please select a color for the calendar items</p>}
                        {isInvalidDate &&
                            <p className="error-message text-red-600 text-sm" id="invalid-helper">Please select a weekday for the start date</p>}
                        <div className="pt-4 mb-4 flex gap-4 flex-col sm:flex-row">
                            <button onClick={handleApplyTemplate} className="btn btn-sm py-1 max-w-fit btn-primary text-white">Add to app calendar</button>
                            <button onClick={() => convertToGoogle(modules, startDate, course.name)} className="btn btn-sm py-1 max-w-xs btn-success text-white">Add to Google calendar </button>
                            <DeleteBtn onClick={() => deleteCourseFromGoogle(course.name)}>Remove from Google calendar</DeleteBtn>
                        </div>
                    </section >
                }
            </Page >
    )
}