import { Link, useNavigate } from "react-router-dom";
import { deleteCourse, getCourseById } from "../../../api/CourseApi";
import Page from "../../../components/Page";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getIdFromPath } from "../../../helpers/helperMethods";
import { getAllModules } from "../../../api/ModuleApi";
import { useEffect, useRef, useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { getAllAppliedCourses, postAppliedCourse } from "../../../api/AppliedCourseApi";
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
import NavigateToLogin from "../../login/NavigateToLogin";

export default function CourseDetails() {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [color, setColor] = useState("#FFFFFF");
    const [isColorNotSelected, setIsColorNotSelected] = useState<boolean>(false);
    const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [isOpenedDelete, setIsOpenedDelete] = useState<boolean>(false);

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

    const { data: allAppliedCourses } = useQuery({
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

    var modules: ModuleType[] = [];
    course?.moduleIds.forEach(element => {
        var module = allModules?.find(m => m.id == element);
        modules.push(module!)
    });

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
            const appliedCourse: AppliedCourseType = {
                startDate: startDate,
                courseId: parseInt(courseId),
                color: color
            };
            const response = postAppliedCourse(appliedCourse);
            if ((await response).ok) {
                navigate('/calendar/month')
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
        getCookie("access_token") == undefined ?
            <NavigateToLogin />
            :
            <Page>
                {isLoading && <LoadingMessage />}
                {isError && <ErrorMessage />}
                {course &&
                    <section className="mx-auto flex flex-col gap-4 px-4 md:px-24 lg:px-56">
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

                        <div className="pt-4 flex gap-4 flex-col sm:flex-row">
                            {usedCourses.find(c => c == course.id)
                                ? <Popup
                                    open={isOpenedDelete}
                                    onOpen={() => setIsOpenedDelete(true)}
                                    trigger={<DeleteBtn onClick={() => { }} >Delete Course</DeleteBtn>}
                                    modal
                                >
                                    {
                                        <div ref={popupRef}>
                                            <div className="flex flex-col">
                                                <div className="flex justify-end">
                                                    <CloseBtn onClick={() => setIsOpenedDelete(false)} />
                                                </div>
                                                <h1 className="m-2">This course is used in the calendar. Deleting it will remove all calendar entries using this course.</h1>
                                                <h1 className="font-bold m-2">Do you want to continue?</h1>
                                                <div className="flex items-center justify-center mb-4 gap-2">
                                                    <input onClick={() => mutation.mutate(parseInt(courseId))} className="btn btn-sm mt-4 w-24 btn-success text-white" value={"Yes"} />
                                                    <input className="btn btn-sm mt-4 w-24 btn-error text-white" value={"No"} onClick={() => setIsOpenedDelete(false)} />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </Popup>
                                : <DeleteBtn onClick={() => mutation.mutate(parseInt(courseId))} >Delete Course</DeleteBtn>
                            }
                            <Link to={`/courses/edit/${courseId}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit Course</Link>
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
                            <button onClick={handleApplyTemplate} className="btn btn-sm py-1 max-w-fit btn-primary text-white">Add to calendar</button>
                            <button onClick={() => convertToGoogle(modules, startDate, course.name)} className="btn btn-sm py-1 max-w-xs btn-success text-white">Add to Google calendar </button>
                            <DeleteBtn onClick={() => deleteCourseFromGoogle(course.name)}>Remove from Google calendar</DeleteBtn>
                        </div>
                    </section >
                }
            </Page >
    )
}