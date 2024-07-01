import { useMutation, useQuery, useQueryClient } from "react-query";
import { getAllModules } from "../../api/ModuleApi";
import SuccessBtn from "../buttons/SuccessBtn";
import InputSmall from "../inputFields/InputSmall";
import DropDown from "../DropDown";
import PrimaryBtn from "../buttons/PrimaryBtn";
import { FormEvent, useState } from "react";
import DeleteBtn from "../buttons/DeleteBtn";
import { CourseModule, CourseProps, CourseType } from "./Types";
import { useNavigate } from "react-router-dom";

export default function Course({ submitFunction, course, buttonText }: CourseProps) {
    const [courseName, setCourseName] = useState<string>(course.name);
    const [numOfWeeks, setNumOfWeeks] = useState<number>(course.numberOfWeeks);
    const [isIncorrectModuleInput, setIsIncorrectModuleInput] = useState<boolean>(false);
    const [isIncorrectName, setIsIncorrectName] = useState<boolean>(false);
    const [isNotSelected, setIsNotSelected] = useState<boolean>(false);
    const navigate = useNavigate();

    const { data: modules } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });

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
    console.log(courseModules);

    var filledDays: number = 0;
    courseModules.forEach(cm => {
        var mod = modules?.find(m => m.id == cm.moduleId);
        if (mod)
            filledDays = filledDays + mod?.numberOfDays;
    });

    const handleAddModules = () => {
        const emptyCourseModule: CourseModule = {
            course: {
                name: "",
                numberOfWeeks: 1,
                modules: [],
                moduleIds: [0]
            }
        }
        const editedModules = [...courseModules];
        editedModules.push(emptyCourseModule);
        setCourseModules(editedModules);
    }

    const handleDeleteModule = (index: number) => {
        const editedModules = [...courseModules];
        editedModules.splice(index, 1);
        console.log(editedModules);
        setCourseModules(editedModules);
    }

    const handleNumberOfWeeks = () => {
        // change counter of days filled with modules
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
        if (isDuplicate || courseName.value == "" || numberOfWeeks.value == 0 || courseModules.some(cm => cm.moduleId == 0) || courseModules.some(c => c.course?.moduleIds.some(mid => mid == 0))) {
            if (isDuplicate)
                setIsIncorrectModuleInput(true);
            if (courseName.value == "" || numberOfWeeks.value == 0)
                setIsIncorrectName(true);
            if (courseModules.some(cm => cm.moduleId == 0) || courseModules.some(c => c.course?.moduleIds.some(mid => mid == 0)))
                setIsNotSelected(true);
        }
        else {
            const newCourse: CourseType = {
                id: course.id ?? 0,
                name: courseName.value,
                numberOfWeeks: numberOfWeeks.value,
                moduleIds: courseModuleIds,
                modules: courseModules,
            };

            console.log("course to post: ", newCourse);
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

    return (
        <section className="px-4 md:px-24 lg:px-56">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                <div className="w-auto flex justify-between space-x-2">
                    <InputSmall type="text" name="courseName" onChange={(e) => setCourseName(e.target.value)} placeholder="Course name" value={courseName} />
                    {numOfWeeks == 0
                        ? <input className="input input-bordered input-sm" type="number" name="numberOfWeeks" onChange={(e) => setNumOfWeeks(parseInt(e.target.value))} placeholder="Number of weeks" />
                        : <input className="input input-bordered input-sm" type="number" name="numberOfWeeks" onChange={(e) => setNumOfWeeks(parseInt(e.target.value))} value={numOfWeeks} placeholder="Number of weeks" />
                    }
                    <PrimaryBtn onClick={handleNumberOfWeeks}>Apply</PrimaryBtn>
                </div>
                {isIncorrectName &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Enter a correct name and number of weeks</p>}
                {modules && courseModules.map((thisCourseModule, index) =>
                    <div key={thisCourseModule.moduleId + "," + index} className="flex space-x-2">
                        {thisCourseModule.moduleId == 0 || thisCourseModule.course?.moduleIds.some(mid => mid == 0)
                            ? <DropDown thisCourseModule={thisCourseModule} index={index} selectedModules={courseModules} modules={modules} setSelectedModules={setCourseModules} isSelected={false} />
                            : <DropDown thisCourseModule={thisCourseModule} index={index} selectedModules={courseModules} modules={modules} setSelectedModules={setCourseModules} isSelected={true} />}
                        {courseModules &&
                            <div className="flex items-end">
                                <PrimaryBtn onClick={() => handleAddModules()}>+</PrimaryBtn>
                            </div>}
                        {courseModules.length > 1 &&
                            <div className="flex items-end">
                                <DeleteBtn handleDelete={() => handleDeleteModule(index)} />
                            </div>}
                    </div>)}
                {isIncorrectModuleInput &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Cannot select duplicate modules</p>}
                {isNotSelected &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Please select a module from the dropdown menu</p>}
                <p>You have selected {Math.floor(filledDays/5)} weeks and {filledDays % 5} days (target: {numOfWeeks} weeks)</p>
                <SuccessBtn value={buttonText} />
            </form>
        </section>
    )
}

