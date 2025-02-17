
import { useMutationPostAppliedCourse, useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import { CourseType } from "../../../api/Types";
import { EditBootcamp } from "./EditBootcamp";
import { handleApplyTemplate } from "../helpers/courseUtils";
import { handleUpdateCourse } from "@models/appliedCourse/helpers/appliedCourseUtils";


type Props = {
    course: CourseType,
}



export default function DeployModal({ course }: Props) {

    const mutationPostAppliedCourse = useMutationPostAppliedCourse();
    const mutationUpdateAppliedCourse = useMutationUpdateAppliedCourse();


    return (
        <dialog id="my_DeployModal_1" className="modal">
            <div className="modal-box max-w-none w-[80vw]">
                {!course.isApplied   && <EditBootcamp course={course} submitFunction={handleApplyTemplate} mutation={mutationPostAppliedCourse} /> }
            
                { course.isApplied && course.modules.length > 0 &&   <EditBootcamp course={course} submitFunction={handleUpdateCourse} mutation={mutationUpdateAppliedCourse} /> }
                
            </div>
        </dialog>
    )
}