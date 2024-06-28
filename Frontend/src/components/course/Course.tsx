// import { useMutation, useQuery, useQueryClient } from "react-query";
// import { getAllCourseModules, getAllModules } from "../../api/ModuleApi";
// import SuccessBtn from "../buttons/SuccessBtn";
// import InputSmall from "../inputFields/InputSmall";
// import DropDown from "../DropDown";
// import PrimaryBtn from "../buttons/PrimaryBtn";
// import { FormEvent, useState } from "react";
// import DeleteBtn from "../buttons/DeleteBtn";
// import { ModuleType } from "../module/Types";
// import { CourseModule, CourseProps, CourseType } from "./Types";
// import { useNavigate } from "react-router-dom";

// export default function Course({ submitFunction, course, buttonText }: CourseProps) {
//     const [courseName, setCourseName] = useState<string>(course.name);
//     const [numOfWeeks, setNumOfWeeks] = useState<number>(course.numberOfWeeks);
//     const [isIncorrectModuleInput, setIsIncorrectModuleInput] = useState<boolean>(false);
//     const [isIncorrectName, setIsIncorrectName] = useState<boolean>(false);
//     const navigate = useNavigate();

//     const { data: modules } = useQuery({
//         queryKey: ['modules'],
//         queryFn: getAllModules
//     });

//     var selectedModules: CourseModule[] = [{
//         course: course,
//         courseId: course.id,
//         module: {
//             name: "",
//             numberOfDays: 0,
//             days: [],
//             courseModules: []
//         },
//         moduleId: 0,
//     }];
//     if (course.moduleIds[0] != 0) {
//         selectedModules = [];
//         course.moduleIds.forEach(element => {
//             var module = modules?.find(m => m.id == element);

//             var cm: CourseModule = {
//                 course: course,
//                 courseId: course.id,
//                 module: module,
//                 moduleId: element
//             }
//             selectedModules.push(cm);
//         });
//     }
//     const [courseModules, setCourseModules] = useState<CourseModule[]>(selectedModules);

//     const handleAddModules = () => {
//         const emptyModule: ModuleType = {
//             name: "",
//             numberOfDays: 0,
//             days: []
//         }
//         const emptyCourseModule: CourseModule = {
//             module: emptyModule,
//         }
//         const editedModules = [...courseModules];
//         editedModules.push(emptyCourseModule);
//         setCourseModules(editedModules);
//     }

//     const handleDeleteModule = (index: number) => {
//         const editedModules = [...courseModules];
//         editedModules.splice(index, 1);
//         setCourseModules(editedModules);
//     }

//     const handleNumberOfWeeks = () => {
//         // change counter of days filled with modules
//     }

//     const queryClient = useQueryClient();

//     const mutation = useMutation({
//         mutationFn: (course: CourseType) => {
//             return submitFunction(course);
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['courses'] })
//             navigate(`/courses`)
//         }
//     })

//     const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         const { courseName } = e.target as typeof e.target & { courseName: { value: string } };
//         const { numberOfWeeks } = e.target as typeof e.target & { numberOfWeeks: { value: number } };

//         var courseModuleIds: number[] = [];
//         courseModules.forEach(element => {
//             courseModuleIds.push(element.moduleId!);
//         });

//         setIsIncorrectModuleInput(false);
//         setIsIncorrectName(false);

//         const isDuplicate = findDuplicates(courseModules);
//         if (isDuplicate || courseName.value == "" || numberOfWeeks.value == 0) {
//             if (isDuplicate)
//                 setIsIncorrectModuleInput(true);
//             if (courseName.value == "" || numberOfWeeks.value == 0)
//                 setIsIncorrectName(true);
//         }
//         else {
//             const newCourse: CourseType = {
//                 id: course.id ?? 0,
//                 name: courseName.value,
//                 numberOfWeeks: numberOfWeeks.value,
//                 moduleIds: courseModuleIds,
//                 modules: courseModules,
//             };

//             console.log("course to post: ", newCourse);
//             mutation.mutate(newCourse);
//         }
//     }

//     const findDuplicates = (arr: Array<CourseModule>) => {
//         var results = false;
//         for (var i = 0; i < arr.length; i++) {
//             if (arr.filter(m => m.moduleId == arr[i].moduleId).length > 1) {
//                 results = true;
//                 break;
//             }
//         }
//         return results;
//     }

//     return (
//         <section className="px-4">
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
//                 <div className="w-[320px] overflow-scroll sm:w-auto sm:overflow-auto flex space-x-8">
//                     <InputSmall type="text" name="courseName" onChange={(e) => setCourseName(e.target.value)} placeholder="Course name" value={courseName} />
//                     <input type="number" name="numberOfWeeks" onChange={(e) => setNumOfWeeks(parseInt(e.target.value))} value={numOfWeeks} className="input input-bordered input-sm max-w-xs" placeholder="Number of weeks" />
//                     <PrimaryBtn onClick={handleNumberOfWeeks}>Apply</PrimaryBtn>
//                 </div>
//                 {isIncorrectName &&
//                     <p className="error-message text-red-600 text-sm" id="invalid-helper">Enter a correct name and number of weeks</p>}
//                 {modules && courseModules.map((_num, index) =>
//                     <div key={index} className="flex space-x-8">
//                         <DropDown index={index} selectedModules={courseModules} modules={modules} setModules={setCourseModules} isCreate={buttonText == "Create"} />
//                         {courseModules.length > 1 &&
//                             <DeleteBtn handleDelete={() => handleDeleteModule(index)} />}
//                         {index + 1 == courseModules.length &&
//                             <PrimaryBtn onClick={handleAddModules}>+</PrimaryBtn>}
//                     </div>)}
//                 {isIncorrectModuleInput &&
//                     <p className="error-message text-red-600 text-sm" id="invalid-helper">Cannot select duplicate modules</p>}
//                 <SuccessBtn value={buttonText} />
//             </form>
//         </section>
//     )
// }

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
import { th } from "date-fns/locale";

export default function Course({ submitFunction, course, buttonText }: CourseProps) {
    const [courseName, setCourseName] = useState<string>(course.name);
    const [numOfWeeks, setNumOfWeeks] = useState<number>(course.numberOfWeeks);
    const [isIncorrectModuleInput, setIsIncorrectModuleInput] = useState<boolean>(false);
    const [isIncorrectName, setIsIncorrectName] = useState<boolean>(false);
    const navigate = useNavigate();

    const { data: modules } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });
    console.log(modules);

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

        const isDuplicate = findDuplicates(courseModules);
        if (isDuplicate || courseName.value == "" || numberOfWeeks.value == 0) {
            if (isDuplicate)
                setIsIncorrectModuleInput(true);
            if (courseName.value == "" || numberOfWeeks.value == 0)
                setIsIncorrectName(true);
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
                    <div key={thisCourseModule.moduleId} className="flex space-x-2">
                        {thisCourseModule.moduleId == 0 || thisCourseModule.course?.moduleIds[0] == 0
                            ? <DropDown thisCourseModule={thisCourseModule} index={index} selectedModules={courseModules} modules={modules} setModules={setCourseModules} selected={false} />
                            : <DropDown thisCourseModule={thisCourseModule} index={index} selectedModules={courseModules} modules={modules} setModules={setCourseModules} selected={true} />}
                        {courseModules.length > 1 &&
                            <div className="flex items-end">
                                <DeleteBtn handleDelete={() => handleDeleteModule(index)} />
                            </div>}
                        {index + 1 == courseModules.length &&
                            <div className="flex items-end">
                                <PrimaryBtn onClick={handleAddModules}>+</PrimaryBtn>
                            </div>}
                    </div>)}
                {isIncorrectModuleInput &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Cannot select duplicate modules</p>}
                <SuccessBtn value={buttonText} />
            </form>
        </section>
    )
}