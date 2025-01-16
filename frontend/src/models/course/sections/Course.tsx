import { useCourse } from "../helpers/useCourse";
import { findDuplicates, isStringInputIncorrect } from "../helpers/courseUtils";
import ModuleRow from "./ModuleRow";
import { FormEvent, useEffect, useState } from "react";
import { CourseProps, CourseType } from "../Types";
import { useMutationPostCourse, useMutationUpdateCourse } from "@api/course/courseMutations";
import InputSmall from "@components/inputFields/InputSmall";
import SuccessBtn from "@components/buttons/SuccessBtn";
import { useNavigate } from "react-router-dom";
import { useQueryTracks } from "@api/track/trackQueries";

export default function Course({ course, buttonText }: CourseProps) {
    const { courseModules, setCourseModules, filteredModules, tracks } = useCourse(course.id!);
    const [courseName, setCourseName] = useState(course.name);
    const [numOfWeeks, setNumOfWeeks] = useState(course.numberOfWeeks || 0);
    const [isIncorrectModuleInput, setIsIncorrectModuleInput] = useState<boolean>(false);
    const [isIncorrectName, setIsIncorrectName] = useState<boolean>(false);
    const [isNotSelected, setIsNotSelected] = useState<boolean>(false);
    const mutationPostCourse = useMutationPostCourse();
    const mutationUpdateCourse = useMutationUpdateCourse();
    const navigate = useNavigate();
    const [filledDaysCount, setFilledDaysCount] = useState<number>(0);
  const { data: trackData, isLoading: isLoadingTracks, isError: isErrorTracks } = useQueryTracks();

    useEffect(() => {
        let filledDays: number = 0;
        if (courseModules) {
            courseModules.forEach(module => filledDays += module.numberOfDays);
            setFilledDaysCount(filledDays);
        }
    }, [courseModules]);

    const handleAddModule = (index: number) => {
        const newModules = [...courseModules];
        newModules.splice(index + 1, 0, { id: 0, name: "", numberOfDays: 0, days: [], startDate: new Date() });
        setCourseModules(newModules);
    };

    const handleDeleteModule = (index: number) => {
        const newModules = courseModules.filter((_, i) => i !== index);
        setCourseModules(newModules);
    };

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
                track: course.track,
                modules: []
            };
            if (newCourse.id == 0) {
                console.log(newCourse)
                mutationPostCourse.mutate(newCourse);
            } else {
                mutationUpdateCourse.mutate(newCourse);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            {isIncorrectName &&
                <p className="error-message text-red-600 text-sm" id="invalid-helper">Enter a correct name and number of weeks</p>}
            <p>Tracks: {trackData?.map(t => t.name)}</p>

            <InputSmall type="text" name="courseName" onChange={(e) => setCourseName(e.target.value)} placeholder="Course name" value={courseName} />
            <input className="w-3/4 input input-bordered input-sm" type="number" name="numberOfWeeks" onChange={(e) => setNumOfWeeks(parseInt(e.target.value))} placeholder="Number of weeks" value={numOfWeeks == 0 ? "" : numOfWeeks.toString()} min="0" />
            {courseModules.map((module, index) => (
                <ModuleRow
                    key={index}
                    module={module}
                    index={index}
                    courseModules={courseModules}
                    setCourseModules={setCourseModules}
                    filteredModules={filteredModules}
                    onAdd={() => handleAddModule(index)}
                    onDelete={() => handleDeleteModule(index)}
                    onMoveUp={() => moveUp(index)}
                    onMoveDown={() => moveDown(index)}
                />
            ))}


            {isIncorrectModuleInput &&
                <p className="error-message text-red-600 text-sm" id="invalid-helper">Cannot select duplicate modules</p>}
            {isNotSelected &&
                <p className="error-message text-red-600 text-sm" id="invalid-helper">Please select a module from the dropdown menu</p>}
            <p>You have selected {Math.floor(filledDaysCount / 5)} week(s) and {filledDaysCount % 5} day(s) (target: {numOfWeeks} weeks)</p>

            <div className="flex flex-row gap-2">
                <SuccessBtn value={buttonText}></SuccessBtn>
                <button onClick={() => navigate(`/courses/details/${course.id}`)} className="btn btn-sm mt-4 max-w-66 btn-info text-white">Go back without saving changes</button>
            </div>
        </form>
    );
}