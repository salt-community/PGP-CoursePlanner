
import { CourseType } from "../Types";
import { EditBootcamp } from "./EditBootcamp";


type Props = {
    course: CourseType,
}



export default function DeployModal({ course }: Props) {



    return (
        <dialog id="my_DeployModal_1" className="modal">
            <div className="modal-box max-w-none w-[80vw]">
                <EditBootcamp course={course} />
            </div>
        </dialog>
    )
}