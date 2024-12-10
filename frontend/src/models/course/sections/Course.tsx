import { useCourse } from "../helpers/useCourse";
import { findDuplicates, isStringInputIncorrect } from "../helpers/courseUtils";
import ModuleRow from "./ModuleRow";
import { FormEvent, useState } from "react";
import { CourseProps } from "../Types";

export default function Course({ course, buttonText }: CourseProps) {
    const { courseModules, setCourseModules, filteredModules, tracks } = useCourse(course.id!);
    const [courseName, setCourseName] = useState(course.name);
    const [numOfWeeks, setNumOfWeeks] = useState(course.numberOfWeeks || 0);

    const handleAddModule = (index: number) => {
        const newModules = [...courseModules];
        newModules.splice(index + 1, 0, { id: 0, name: "", numberOfDays: 0, days: [] });
        setCourseModules(newModules);
    };

    const handleDeleteModule = (index: number) => {
        const newModules = courseModules.filter((_, i) => i !== index);
        setCourseModules(newModules);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isStringInputIncorrect(courseName) || numOfWeeks <= 0 || findDuplicates(courseModules)) {
            // Handle validation errors
        } else {
            // Submit data
        }
    };

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
                    onMoveUp={() => {} /* Logic */}
                    onMoveDown={() => {} /* Logic */}
                />
            ))}
            <button type="submit">{buttonText}</button>
        </form>
    );
}