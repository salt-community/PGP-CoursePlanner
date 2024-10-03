import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllModules } from "../../../api/ModuleApi";
import SuccessBtn from "../../../components/buttons/SuccessBtn";
import InputSmall from "../../../components/inputFields/InputSmall";
import DropDown from "../../../components/DropDown";
import PrimaryBtn from "../../../components/buttons/PrimaryBtn";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrashBtn from "../../../components/buttons/TrashBtn";
import { CourseProps, CourseModule, CourseType } from "../Types";
import FilterArea from "./FilterArea";
import { ModuleType } from "../../module/Types";

export default function Course({ submitFunction, course, buttonText }: CourseProps) {
    const [courseName, setCourseName] = useState<string>(course.name);
    const [numOfWeeks, setNumOfWeeks] = useState<number>(course.numberOfWeeks);
    const [isIncorrectModuleInput, setIsIncorrectModuleInput] = useState<boolean>(false);
    const [isIncorrectName, setIsIncorrectName] = useState<boolean>(false);
    const [isNotSelected, setIsNotSelected] = useState<boolean>(false);
    const navigate = useNavigate();
    const [filteredModules, setFilteredModules] = useState<ModuleType[]>([]);
    const [tracks, setTracks] = useState<string[]>([]);

    const { data: modules } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });
    useEffect(() => {
        if (modules) {
            setFilteredModules(modules);

            const tempTracks: string[] = [];
            for (let trackArray of modules!.filter(m => m.track!).map(m => m.track!)) {
                trackArray.forEach(track => {
                    if (!tempTracks.find(t => t == track)) {
                        tempTracks.push(track);
                    }
                });
            }
            setTracks(tempTracks);
        }
    }, [modules]);

    var selectedModules: CourseModule[] = [{
        courseId: 0,
        moduleId: 0,
    }];
    if (course.moduleIds[0] != 0) {
        selectedModules = [];
        course.moduleIds.forEach(moduleId => {
            var module = modules?.find(m => m.id == moduleId);

            var cm: CourseModule = {
                course: course,
                courseId: course.id,
                module: module,
                moduleId: moduleId
            }
            selectedModules.push(cm);
        });
    }
    const [courseModules, setCourseModules] = useState<CourseModule[]>(selectedModules);

    var filledDays: number = 0;
    courseModules.forEach(cm => {
        var mod = modules?.find(m => m.id == cm.moduleId);
        if (mod)
            filledDays = filledDays + mod?.numberOfDays;
    });

    const handleAddModules = (index: number) => {
        const emptyCourseModule: CourseModule = {
            course: {
                name: "",
                numberOfWeeks: 1,
                modules: [],
                moduleIds: [0]
            }
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

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (course: CourseType) => {
            return submitFunction(course);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            navigate(`/courses`)
        }
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { courseName } = e.target as typeof e.target & { courseName: { value: string } };
        const { numberOfWeeks } = e.target as typeof e.target & { numberOfWeeks: { value: number } };

        var courseModuleIds: number[] = [];
        courseModules.forEach(element => {
            courseModuleIds.push(element.moduleId!);
        });

        setIsIncorrectModuleInput(false);
        setIsIncorrectName(false);
        setIsNotSelected(false);
        const isDuplicate = findDuplicates(courseModules);
        if (isDuplicate || isStringInputIncorrect(courseName.value) || numberOfWeeks.value == 0 || courseModules.some(cm => cm.moduleId == 0) || courseModules.some(c => c.course?.moduleIds.some(mid => mid == 0))) {
            if (isDuplicate)
                setIsIncorrectModuleInput(true);
            if (isStringInputIncorrect(courseName.value) || numberOfWeeks.value == 0)
                setIsIncorrectName(true);
            if (courseModules.some(cm => cm.moduleId == 0) || courseModules.some(c => c.course?.moduleIds.some(mid => mid == 0)))
                setIsNotSelected(true);
        }
        else {
            const newCourse: CourseType = {
                id: course.id ?? 0,
                name: courseName.value.trim(),
                numberOfWeeks: numberOfWeeks.value,
                moduleIds: courseModuleIds,
                modules: courseModules,
            };

            mutation.mutate(newCourse);
        }
    }

    const findDuplicates = (arr: Array<CourseModule>) => {
        var results = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr.filter(m => m.moduleId == arr[i].moduleId).length > 1) {
                results = true;
                break;
            }
        }
        return results;
    }

    const isStringInputIncorrect = (str: string) => {
        var strNoSpace = str.replaceAll(" ", "");
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
                setFilteredModules(selectedModules);

                const editedModules = [...courseModules];
                editedModules.forEach((cm, index) => {
                    const isModulePossible = selectedModules.find(fm => fm.id == cm.moduleId);

                    const emptyCourseModule: CourseModule = {
                        course: {
                            name: "",
                            numberOfWeeks: 1,
                            modules: [],
                            moduleIds: [0]
                        }
                    }
                    if (isModulePossible == undefined)
                        editedModules[index] = emptyCourseModule;
                });
                setCourseModules(editedModules);
            }
        } else {
            console.log("No track selected.");
        }
    }

    function getLastTrackedUrl(): string | null {
        const history = JSON.parse(localStorage.getItem('urlHistory') || '[]');

        if (history.length > 0) {
            return history[history.length - 1];
        } else {
            return null;
        }
    }
    const lastTrackedUrl = getLastTrackedUrl();
    const splitUrl = lastTrackedUrl?.split("5173")    //change this for deploy!

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
                            ? <input className="w-3/4 input input-bordered input-sm" type="number" name="numberOfWeeks" onChange={(e) => setNumOfWeeks(parseInt(e.target.value))} placeholder="Number of weeks" />
                            : <input className="w-3/4 input input-bordered input-sm" type="number" name="numberOfWeeks" onChange={(e) => setNumOfWeeks(parseInt(e.target.value))} value={numOfWeeks} placeholder="Number of weeks" />
                        }
                    </div>
                    {modules &&
                        <FilterArea modules={modules} options={tracks} funcFilter={funcFilter} funcResetFilter={() => { }}></FilterArea>
                    }
                </div>
                {isIncorrectName &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Enter a correct name and number of weeks</p>}
                {modules && courseModules.map((thisCourseModule, index) =>
                    <div className="flex flex-row">
                        {index == 0 && index != courseModules.length - 1 &&
                            <div className="flex flex-col w-[26px] mr-2">
                                <button type="button" className="w-full h-full self-center" onClick={() => moveDown(index)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
                            </div>
                        }
                        {index != 0 && index == courseModules.length - 1 &&
                            <div className="flex flex-col w-[26px] mr-2">
                                <button type="button" className="w-full h-full self-center" onClick={() => moveUp(index)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                            </div>
                        }
                        {index != 0 && index != courseModules.length - 1 &&
                            <div className="flex flex-col w-[26px] mr-2">
                                <button type="button" className="w-full h-full self-center" onClick={() => moveUp(index)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6" /></svg></button>
                                <button type="button" className="w-full h-full self-center" onClick={() => moveDown(index)}><svg className="self-center" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg></button>
                            </div>
                        }
                        {index == 0 && index == courseModules.length - 1 &&
                            <div className="flex flex-col w-[26px] mr-2">
                            </div>
                        }
                        <h2 className="self-center font-bold w-[100px]">Module {index + 1}</h2>
                        <div key={thisCourseModule.moduleId + "," + index} className="flex space-x-2">
                            {thisCourseModule.moduleId == 0 || thisCourseModule.course?.moduleIds.some(mid => mid == 0)
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
                    </div>)}
                {isIncorrectModuleInput &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Cannot select duplicate modules</p>}
                {isNotSelected &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Please select a module from the dropdown menu</p>}
                {Math.floor(filledDays / 5) == 1 && numOfWeeks == 1 &&
                    <p>You have selected {Math.floor(filledDays / 5)} week and {filledDays % 5} days (target: {numOfWeeks} week)</p>}
                {Math.floor(filledDays / 5) == 1 && numOfWeeks != 1 &&
                    <p>You have selected {Math.floor(filledDays / 5)} week and {filledDays % 5} days (target: {numOfWeeks} weeks)</p>}
                {Math.floor(filledDays / 5) != 1 && numOfWeeks == 1 &&
                    <p>You have selected {Math.floor(filledDays / 5)} weeks and {filledDays % 5} days (target: {numOfWeeks} week)</p>}
                {Math.floor(filledDays / 5) != 1 && numOfWeeks != 1 &&
                    <p>You have selected {Math.floor(filledDays / 5)} weeks and {filledDays % 5} days (target: {numOfWeeks} weeks)</p>}
                <div className="flex flex-row gap-2">
                    <SuccessBtn value={buttonText}></SuccessBtn>
                    <button onClick={() => navigate(splitUrl![1])} className="btn btn-sm mt-4 max-w-66 btn-info text-white">Go back without saving changes</button>
                </div>
            </form>
        </section>
    )
}

