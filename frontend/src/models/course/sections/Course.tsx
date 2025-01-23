import { useCourse } from "../helpers/useCourse";
import { findDuplicates, isStringInputIncorrect } from "../helpers/courseUtils";
import ModuleRow from "./ModuleRow";
import { useEffect, useState } from "react";
import { CourseProps, CourseType } from "../Types";
import { useMutationPostCourse, useMutationUpdateCourse } from "@api/course/courseMutations";
// import { useNavigate } from "react-router-dom";
import { useQueryTracks } from "@api/track/trackQueries";



import { useForm, SubmitHandler } from "react-hook-form"
import LoadingMessage from "@components/LoadingMessage";
import ErrorModal from "@components/ErrorModal";

type Inputs = {
    courseName: string;
    numberOfWeeks: number;
    trackId: number; // or `number` depending on the track's unique identifier
};


export default function Course({ course }: CourseProps) {
    const { courseModules, setCourseModules, filteredModules } = useCourse(course.id!);
    const [isIncorrectModuleInput, setIsIncorrectModuleInput] = useState<boolean>(false);
    // const [isIncorrectName, setIsIncorrectName] = useState<boolean>(false);
    const [isNotSelected, setIsNotSelected] = useState<boolean>(false);
    const mutationPostCourse = useMutationPostCourse();
    const mutationUpdateCourse = useMutationUpdateCourse();
    // const navigate = useNavigate();
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
        newModules.splice(index + 1, 0, { id: 0, name: "", numberOfDays: 0, days: [], startDate: new Date });
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



    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
        handleSubmitOG(data)
    }

    // console.log(watch("courseName")) // watch input value by passing the name of it



    const handleSubmitOG = (inputs: Inputs) => {

        const courseName = inputs.courseName;
        const numberOfWeeks = inputs.numberOfWeeks

        const courseModuleIds: number[] = [];
        courseModules.forEach(element => {
            courseModuleIds.push(element.id!);
        });

        setIsIncorrectModuleInput(false);
        setIsNotSelected(false);
        const isDuplicate = findDuplicates(courseModules);
        if (isDuplicate || isStringInputIncorrect(courseName) || numberOfWeeks == 0 || courseModules.some(cm => cm.id == 0)) {
            if (isDuplicate)
                setIsIncorrectModuleInput(true);
            if (isStringInputIncorrect(courseName) || numberOfWeeks == 0)
                if (courseModules.some(cm => cm.id == 0) || course.moduleIds!.some(mid => mid == 0))
                    setIsNotSelected(true);
        }
        else {
            const newCourse: CourseType = {
                id: course.id,
                name: courseName.trim(),
                startDate: course.startDate,
                numberOfWeeks: numberOfWeeks,
                moduleIds: courseModuleIds,
                track: trackData!.find(t => t.id == inputs.trackId)!,
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
        <>
            {(isErrorTracks || isLoadingTracks) &&
                <LoadingMessage></LoadingMessage>}

            {trackData &&
                <div className="p-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-1/4">

                        <label>
                            Select a track
                            <select
                                className="select select-bordered w-full max-w-xs"
                                {...register("trackId", { required: true })}
                            >
                                <option value="" disabled selected>
                                    Select a track
                                </option>
                                {trackData && trackData.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>

                            {errors.trackId && <span className="text-red-500">***</span>}

                        </label>

                        <label>
                            Course Name
                            <input defaultValue={course.name} {...register("courseName", { required: true })} />
                            {errors.courseName && <span className="text-red-500">***</span>}

                        </label>

                        <label>
                            Number of weeks
                            <input
                                type="number"
                                defaultValue={course.numberOfWeeks}
                                {...register("numberOfWeeks", { required: true })}
                            />
                        </label>
                        {errors.numberOfWeeks && <span>Specify a number of weeks</span>}



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
                        <p>You have selected {Math.floor(filledDaysCount / 5)} week(s) and {filledDaysCount % 5} day(s) (target: {watch("numberOfWeeks")} weeks)</p>
                        {/* 
                    <div className="flex flex-row gap-2">
                        <SuccessBtn value={buttonText}></SuccessBtn>
                        <button onClick={() => navigate(`/courses/details/${course.id}`)} className="btn btn-sm mt-4 max-w-66 btn-info text-white">Go back without saving changes</button>
                    </div> */}
                        <input className="btn" type="submit" />




                    </form>
                </div>
            }
        {isErrorTracks && <ErrorModal error="Tracks" />}
        </>
    );
}