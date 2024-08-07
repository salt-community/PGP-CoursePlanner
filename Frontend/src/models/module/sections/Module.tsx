import InputSmall from "../../../components/inputFields/InputSmall";
import PrimaryBtn from "../../../components/buttons/PrimaryBtn";
import SuccessBtn from "../../../components/buttons/SuccessBtn";
import Popup from "reactjs-popup";
import { getAllAppliedCourses } from "../../../api/AppliedCourseApi";
import CloseBtn from "../../../components/buttons/CloseBtn";
import { getAllCourses } from "../../../api/CourseApi";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { ModuleProps, DayType, ModuleType, EventType } from "../Types";
import Day from "./Day";

export default function Module({ submitFunction, module, buttonText }: ModuleProps) {
    const navigate = useNavigate();
    const [moduleName, setModuleName] = useState<string>(module.name);
    const [numOfDays, setNumOfDays] = useState<number>(module.days.length);
    const [days, setDays] = useState<DayType[]>(module.days);

    // Fix applied here for handling track as an array
    const [track, setTrack] = useState<string[]>(module.track || ["dotnet"]);

    const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);
    const [isOpened, setIsOpened] = useState<boolean>(false);

    const { data: allAppliedCourses } = useQuery({
        queryKey: ['appliedCourses'],
        queryFn: () => getAllAppliedCourses()
    });

    const { data: allCourses } = useQuery({
        queryKey: ['courses'],
        queryFn: () => getAllCourses()
    });

    const usedCoursesIds: number[] = [];
    if (allAppliedCourses) {
        allAppliedCourses.forEach(element => {
            usedCoursesIds.push(element.courseId);
        });
    }
    const usedModules: number[] = [];
    if (allCourses) {
        usedCoursesIds.forEach(courseId => {
            var course = allCourses.find(c => c.id == courseId);
            var moduleIds = course?.moduleIds;
            moduleIds?.forEach(mId => {
                usedModules.push(mId);
            });
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

    const handleDays = () => {
        const editedDays = days.slice();
        if (numOfDays < days.length) {
            editedDays.splice(numOfDays, days.length - numOfDays);
        }
        else {
            const numOfDaysArray = ([...Array(numOfDays - days.length).keys()].map(i => i + 1));

            numOfDaysArray.map((num) => {
                const newDay = {
                    dayNumber: num + days.length,
                    description: "",
                    events: []
                };

                editedDays.push(newDay);
            });
        }
        setDays(editedDays);
    };

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (module: ModuleType) => {
            return submitFunction(module);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] });
            navigate(`/modules`);
        }
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { moduleName } = e.target as typeof e.target & { moduleName: { value: string } };
        const { numberOfDays } = e.target as typeof e.target & { numberOfDays: { value: number } };
        const { track } = e.target as typeof e.target & { track: { value: string } };
        const events: EventType[] = [];
        days.forEach(day => {
            var eventsOfDay = day.events;
            eventsOfDay.forEach(event => {
                events.push(event);
            });
        });

        setIsIncompleteInput(false);
        if (
            moduleName.value == "" || 
            numberOfDays.value == 0 || 
            days.some(d => d.description == "") || 
            events.some(e => e.name == "") || 
            events.some(e => e.startTime == "") || 
            events.some(e => e.endTime == "")
        ) {
            setIsIncompleteInput(true);
        } else {
            const newModule: ModuleType = {
                id: module.id ?? 0,
                name: moduleName.value,
                numberOfDays: numberOfDays.value,
                days: days,
                track: [track.value]  // Ensure track is an array
            };

            mutation.mutate(newModule);
        }
    };

    return (
        <section className="px-4 md:px-24 lg:px-56">
            <form id="editCourse-form" onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                <div className="w-auto flex justify-between space-x-2">
                    <InputSmall 
                        type="text" 
                        name="moduleName" 
                        onChange={(e) => setModuleName(e.target.value)} 
                        placeholder="Module name" 
                        value={moduleName} 
                    />
                    <input 
                        type="number" 
                        name="numberOfDays" 
                        onChange={(e) => setNumOfDays(parseInt(e.target.value))} 
                        value={numOfDays} 
                        className="input input-bordered input-sm max-w-xs" 
                        placeholder="Number of days" 
                    />
                    <select 
                        name="track" 
                        onChange={(e) => setTrack([e.target.value])}  // Handle as array
                        value={track[0]}  // Use first element of the array
                        className="input input-bordered input-sm max-w-xs"
                    >
                        <option value="dotnet">.NET</option>
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                    </select>
                    <PrimaryBtn onClick={handleDays}>Apply</PrimaryBtn>
                </div>
                <div className="flex flex-col space-y-2">
                    {days.map((day) =>
                        <Day 
                            key={"day_" + day.dayNumber} 
                            setDays={setDays} 
                            days={days} 
                            day={day} 
                            setNumOfDays={setNumOfDays} 
                        />
                    )}
                </div>
                {isIncompleteInput &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">
                        Please fill in all the fields
                    </p>
                }

                {usedModules.find(m => m == module.id)
                    ? <Popup
                        open={isOpened}
                        onOpen={() => setIsOpened(true)}
                        trigger={
                            <input 
                                className="mb-4 btn btn-sm mt-4 max-w-48 btn-success text-white" 
                                value={buttonText || "Submit"} 
                            />
                        }
                        modal
                    >
                        <div ref={popupRef}>
                            <div className="flex flex-col">
                                <div className="flex justify-end">
                                    <CloseBtn onClick={() => setIsOpened(false)} />
                                </div>
                                <h1 className="m-2">This module is part of a course used in the calendar. Changing it will change the calendar entries.</h1>
                                <h1 className="font-bold m-2">Do you want to continue?</h1>
                                <div className="flex items-center justify-center mb-4 gap-2">
                                    <input 
                                        type="submit" 
                                        form="editCourse-form" 
                                        className="btn btn-sm mt-4 w-24 btn-success text-white" 
                                        value={"Yes"} 
                                    />
                                    <input 
                                        className="btn btn-sm mt-4 w-24 btn-error text-white" 
                                        value={"No"} 
                                        onClick={() => setIsOpened(false)} 
                                    />
                                </div>
                            </div>
                        </div>
                    </Popup>
                    : <SuccessBtn value={buttonText}></SuccessBtn>
                }
            </form>
        </section>
    );
}
