import SuccessBtn from "@components/buttons/SuccessBtn";
import InputSmall from "@components/inputFields/InputSmall";
import DropDown from "@components/DropDown";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrashBtn from "@components/buttons/TrashBtn";
import { CourseProps, CourseType } from "../Types";
import FilterArea from "./FilterArea";
import { ModuleType } from "@models/module/Types";
import { useQueryModulesByCourseId } from "@api/course/courseQueries";
import { useQueryModules } from "@api/module/moduleQueries";
import { useMutationPostCourse, useMutationUpdateCourse } from "@api/course/courseMutations";

export default function Course({ course, buttonText }: CourseProps) {
    const [courseName, setCourseName] = useState<string>(course.name);
    const [numOfWeeks, setNumOfWeeks] = useState<number>(course.numberOfWeeks!);
    const [isIncorrectModuleInput, setIsIncorrectModuleInput] = useState<boolean>(false);
    const [isIncorrectName, setIsIncorrectName] = useState<boolean>(false);
    const [isNotSelected, setIsNotSelected] = useState<boolean>(false);
    const [filteredModules, setFilteredModules] = useState<ModuleType[]>([]);
    const [tracks, setTracks] = useState<string[]>([]);
    const [courseModules, setCourseModules] = useState<ModuleType[]>([]);
    const [filledDaysCount, setFilledDaysCount] = useState<number>(0);
    const navigate = useNavigate();
    const { data: courseModulesData } = useQueryModulesByCourseId(course.id!);
    const { data: modules } = useQueryModules();
    const mutationPostCourse = useMutationPostCourse();
    const mutationUpdateCourse = useMutationUpdateCourse();

    useEffect(() => {
        if (modules) {
            setFilteredModules(modules);

            const tempTracks: string[] = [];
            for (const trackArray of modules!.filter(m => m.track!).map(m => m.track!)) {
                trackArray.forEach(track => {
                    if (!tempTracks.find(t => t == track)) {
                        tempTracks.push(track);
                    }
                });
            }
            setTracks(tempTracks);
        }
    }, [modules]);

    useEffect(() => {
        if (!courseModulesData) {
            const emptyCourseModule: ModuleType = {
                id: 0,
                name: "",
                numberOfDays: 0,
                days: []
            }
            setCourseModules([emptyCourseModule]);
        } else {
            setCourseModules(courseModulesData ?? []);
        }
    }, [courseModulesData]);

    useEffect(() => {
        let filledDays: number = 0;
        if (courseModules) {
            courseModules.forEach(module => filledDays += module.numberOfDays);
            setFilledDaysCount(filledDays);
        }
    }, [courseModules]);

    const handleAddModules = (index: number) => {
        const emptyCourseModule: ModuleType = {
            id: 0,
            name: "",
            numberOfDays: 0,
            days: []
        }
        const editedModules = [...courseModules];
        editedModules.splice(index + 1, 0, emptyCourseModule);
        setCourseModules(editedModules);
    }

    const handleDeleteModule = (index: number) => {
        const editedModules = [...courseModules];
        editedModules.splice(index, 1);
        setCourseModules(editedModules);
    }

    const moveDown = (index: number) => {
        const editedModules = [...courseModules];

        const temp = editedModules[index];
        editedModules[index] = editedModules[index + 1];
        editedModules[index + 1] = temp;

        setCourseModules(editedModules);
    }

    const moveUp = (index: number) => {
        const editedModules = [...courseModules];

        const temp = editedModules[index];
        editedModules[index] = editedModules[index - 1];
        editedModules[index - 1] = temp;

        setCourseModules(editedModules);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { courseName } = e.target as typeof e.target & { courseName: { value: string } };
        const { numberOfWeeks } = e.target as typeof e.target & { numberOfWeeks: { value: number } };

        const courseModuleIds: number[] = [];
        courseModules.forEach(element => {
            courseModuleIds.push(element.id!);
        });

        setIsIncorrectModuleInput(false);
        setIsIncorrectName(false);
        setIsNotSelected(false);
        const isDuplicate = findDuplicates(courseModules);
        if (isDuplicate || isStringInputIncorrect(courseName.value) || numberOfWeeks.value == 0 || courseModules.some(cm => cm.id == 0)) {
            if (isDuplicate)
                setIsIncorrectModuleInput(true);
            if (isStringInputIncorrect(courseName.value) || numberOfWeeks.value == 0)
                setIsIncorrectName(true);
            if (courseModules.some(cm => cm.id == 0) || course.moduleIds!.some(mid => mid == 0))
                setIsNotSelected(true);
        }
        else {
            const newCourse: CourseType = {
                id: course.id,
                name: courseName.value.trim(),
                startDate: course.startDate,
                numberOfWeeks: numberOfWeeks.value,
                moduleIds: courseModuleIds,
            };
            if (newCourse.id == 0) {
                mutationPostCourse.mutate(newCourse);
            } else {
                mutationUpdateCourse.mutate(newCourse);
            }
        }
    }

    const findDuplicates = (arr: Array<ModuleType>) => {
        let results = false;
        for (let i = 0; i < arr.length; i++) {
            if (arr.filter(m => m.id == arr[i].id).length > 1) {
                results = true;
                break;
            }
        }
        return results;
    }

    const isStringInputIncorrect = (str: string) => {
        const strNoSpace = str.replaceAll(" ", "");
        if (strNoSpace.length > 0)
            return false;
        else
            return true;
    }

    async function funcFilter(formData: FormData) {
        const inputTrack = formData.get('track') as string;
        if (inputTrack) {
            if (inputTrack == "All") {
                setFilteredModules(modules!);
            }
            else {
                const selectedModules = modules!.filter(m => m.track?.includes(inputTrack));
                const editedModules = [...courseModules];
                editedModules.forEach((cm, index) => {
                    setFilteredModules(selectedModules);
                    const isModulePossible = selectedModules.find(fm => fm.id == cm.id);
                    const emptyCourseModule: ModuleType = {
                        id: 0,
                        name: "",
                        numberOfDays: 0,
                        days: []
                    }
                    if (isModulePossible == undefined)

                        editedModules[index] = emptyCourseModule;
                });
                setCourseModules(editedModules);
            }
        }
    }

    return (
        <section className="px-4 md:px-24 lg:px-56">
            <form id="editCourse-form" onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <div className="flex flex-col justify-between">
                    <div className="flex flex-row items-center">
                        <h2 className="self-start mt-2 w-1/4 text-lg mb-2">Course Name: </h2>
                        <div className="w-3/4">
                            <InputSmall type="text" name="courseName" onChange={(e) => setCourseName(e.target.value)} placeholder="Course name" value={courseName} />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <h2 className="self-start mt-2 w-1/4 text-lg mb-2">Number of weeks:</h2>
                        {numOfWeeks == 0
                            ? <input className="w-3/4 input input-bordered input-sm" type="number" name="numberOfWeeks" onChange={(e) => setNumOfWeeks(parseInt(e.target.value))} placeholder="Number of weeks" min="0" />
                            : <input className="w-3/4 input input-bordered input-sm" type="number" name="numberOfWeeks" onChange={(e) => setNumOfWeeks(parseInt(e.target.value))} value={numOfWeeks.toString()} min="0" placeholder="Number of weeks" />
                        }
                    </div>
                    {modules && courseModulesData &&
                        <FilterArea options={tracks} funcFilter={funcFilter} funcResetFilter={() => { }}></FilterArea>
                    }
                </div>
                {isIncorrectName &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Enter a correct name and number of weeks</p>}
                {modules && courseModules && courseModules.map((thisCourseModule, index) =>
                    <div key={index} className="flex flex-row">
                        {index == 0 && index != courseModules.length - 1 &&
                            <div className="flex flex-col w-[26px] mr-2">
                                <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveDown(index)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
                            </div>
                        }
                        {index != 0 && index == courseModules.length - 1 &&
                            <div className="flex flex-col w-[26px] mr-2">
                                <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveUp(index)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                            </div>
                        }
                        {index != 0 && index != courseModules.length - 1 &&
                            <div className="flex flex-col w-[26px] mr-2">
                                <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveUp(index)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                                <button type="button" className="w-full h-full self-center stroke-base-content" onClick={() => moveDown(index)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
                            </div>
                        }
                        {index == 0 && index == courseModules.length - 1 &&
                            <div className="flex flex-col w-[26px] mr-2">
                            </div>
                        }
                        <h2 className="self-center font-bold w-[100px]">Module {index + 1}</h2>
                        <div key={thisCourseModule.id + "," + index} className="flex space-x-2">
                            {thisCourseModule.id == 0
                                ? <DropDown thisCourseModule={thisCourseModule} index={index} selectedModules={courseModules} modules={filteredModules} setSelectedModules={setCourseModules} isSelected={false} />
                                : <DropDown thisCourseModule={thisCourseModule} index={index} selectedModules={courseModules} modules={filteredModules} setSelectedModules={setCourseModules} isSelected={true} />}
                            {courseModules &&
                                <div className="flex items-end self-center">
                                    <PrimaryBtn onClick={() => handleAddModules(index)}>+</PrimaryBtn>
                                </div>}
                            {courseModules.length > 1 &&
                                <div className="flex items-end self-center">
                                    <TrashBtn handleDelete={() => handleDeleteModule(index)} />
                                </div>}
                        </div>
                    </div>
                )}
                {isIncorrectModuleInput &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Cannot select duplicate modules</p>}
                {isNotSelected &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Please select a module from the dropdown menu</p>}
                {Math.floor(filledDaysCount / 5) == 1 && numOfWeeks == 1 &&
                    <p>You have selected {Math.floor(filledDaysCount / 5)} week and {filledDaysCount % 5} days (target: {numOfWeeks} week)</p>}
                {Math.floor(filledDaysCount / 5) == 1 && numOfWeeks != 1 &&
                    <p>You have selected {Math.floor(filledDaysCount / 5)} week and {filledDaysCount % 5} days (target: {numOfWeeks} weeks)</p>}
                {Math.floor(filledDaysCount / 5) != 1 && numOfWeeks == 1 &&
                    <p>You have selected {Math.floor(filledDaysCount / 5)} weeks and {filledDaysCount % 5} days (target: {numOfWeeks} week)</p>}
                {Math.floor(filledDaysCount / 5) != 1 && numOfWeeks != 1 &&
                    <p>You have selected {Math.floor(filledDaysCount / 5)} weeks and {filledDaysCount % 5} days (target: {numOfWeeks} weeks)</p>}
                <div className="flex flex-row gap-2">
                    <SuccessBtn value={buttonText}></SuccessBtn>
                    <button onClick={() => navigate(`/courses/details/${course.id}`)} className="btn btn-sm mt-4 max-w-66 btn-info text-white">Go back without saving changes</button>
                </div>
            </form>
        </section>
    )
}