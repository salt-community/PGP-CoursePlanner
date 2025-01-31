
import { useMutationPostAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import { CourseType } from "../Types";
import { EditBootcamp } from "./EditBootcamp";
import { handleApplyTemplate } from "../helpers/courseUtils";


type Props = {
    course: CourseType,
}



export default function DeployModal({ course }: Props) {

    const mutationPostAppliedCourse = useMutationPostAppliedCourse();

    return (
        <dialog id="my_DeployModal_1" className="modal">
            <div className="modal-box max-w-none w-[80vw]">
                <EditBootcamp course={course} submitFunction={handleApplyTemplate} mutation={mutationPostAppliedCourse} />
            </div>
        </dialog>
    )
}