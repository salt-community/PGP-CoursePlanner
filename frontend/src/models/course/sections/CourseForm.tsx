import { useCourse } from "../helpers/useCourse";
import { findDuplicates, isStringInputIncorrect } from "../helpers/courseUtils";
import ModuleRow from "./ModuleRow";
import { FormEvent, useState } from "react";
import { CourseProps, CourseType } from "../Types";
import { useMutationPostCourse, useMutationUpdateCourse } from "@api/course/courseMutations";

export default function Course({ course, buttonText }: CourseProps) {
    const { courseModules, setCourseModules, filteredModules, tracks } = useCourse(course.id!);
    const [courseName, setCourseName] = useState(course.name);
    const [numOfWeeks, setNumOfWeeks] = useState(course.numberOfWeeks || 0);
    const [isIncorrectModuleInput, setIsIncorrectModuleInput] = useState<boolean>(false);
    const [isIncorrectName, setIsIncorrectName] = useState<boolean>(false);
    const [isNotSelected, setIsNotSelected] = useState<boolean>(false);
    const mutationPostCourse = useMutationPostCourse();
    const mutationUpdateCourse = useMutationUpdateCourse();




    const handleAddModule = (index: number) => {
        const newModules = [...courseModules];
        newModules.splice(index + 1, 0, { id: 0, name: "", numberOfDays: 0, days: [] });
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
            };
            if (newCourse.id == 0) {
                mutationPostCourse.mutate(newCourse);
            } else {
                mutationUpdateCourse.mutate(newCourse);
            }
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <p>Tracks: {tracks} </p>
            <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
            <input type="number" value={numOfWeeks} onChange={(e) => setNumOfWeeks(parseInt(e.target.value))} />
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
                    onMoveUp={() => moveUp(index) /* Logic */}
                    onMoveDown={() => moveDown(index) /* Logic */}
                />
            ))}
            <button type="submit">{buttonText}</button>
        </form>
    );
}