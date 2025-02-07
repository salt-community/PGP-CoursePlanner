import { generateDocument } from "@models/appliedCourse/components/GenerateDocument";
import { CourseType, ModuleType } from "@models/course/Types"
import { usePDF } from "@react-pdf/renderer";

type Props = {
    course: CourseType
    module?: ModuleType
}

export default function PDFDownloadBtn({ course, module }: Props) {
    const courseDocumentName = "CourseOverview_" + course.name + "_" + new Date(course.startDate).toUTCString().slice(5, 16) + "-" + (course.endDate ? new Date(course.endDate).toUTCString().slice(5, 16) : '') + ".pdf"
    const moduleDocumentName = "ModuleOverview_" + course.name + "_" + module?.name + ".pdf"
    const [instance, updateInstance] = usePDF();

    return (
        <button onClick={() => updateInstance(generateDocument(module ? [module] : course.modules.map(m => m.module)))}>
            <a href={instance.url!} download={module ? moduleDocumentName : courseDocumentName}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#636363" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            </a>
        </button>
    )
}