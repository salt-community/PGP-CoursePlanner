import { CourseType } from "@models/course/Types"
import CourseInfo from "../components/CourseInfo"
import Modules from "../components/Modules"
import PrimaryBtn from "@components/buttons/PrimaryBtn"
import { assignDatesToModules, handleCreateNewAppliedModule, handleUpdateCourse } from "../helpers/appliedCourseUtils"
import { useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations"
import { getCourseDayDates, getCourseWithDates, getUpdatedCourse } from "@models/course/helpers/courseUtils"

type Props = {
    appliedCourse: CourseType
    course : CourseType,
    setCourse: React.Dispatch<React.SetStateAction<CourseType>>
}

export function EditCourseDays({appliedCourse, course, setCourse}:Props) {


    const mutationUpdateAppliedCourse = useMutationUpdateAppliedCourse();


    return (
    <section className="px-2 md:px-4 lg:px-8 bg-white rounded-lg p-5 shadow-md mt-5 flex flex-col">
        <div className="flex flex-row gap-5 mt-2 mb-4">
            <CourseInfo course={course} setCourse={setCourse} />
        </div>
        <div>
            <Modules course={course} setCourse={setCourse} assignDatesToModules={() => {const crs =  getUpdatedCourse(course, course.modules[0].module.startDate) 
                                                                                         setCourse(crs)
            }} />
        </div>
        <div>
            <div className="flex justify-center items-center">
                <PrimaryBtn onClick={() => handleCreateNewAppliedModule(course, setCourse)}>
                    + Module
                </PrimaryBtn>
            </div>
            <PrimaryBtn onClick={() => handleUpdateCourse(course, appliedCourse, setCourse, mutationUpdateAppliedCourse)}>Save</PrimaryBtn>
            {/* <PrimaryBtn onClick={handleGoBack}>Abort</PrimaryBtn> */}
        </div>
    </section>
    )
}