import { usePDF } from '@react-pdf/renderer';
import { CourseType } from '@models/course/Types';
import { generateDocument } from '../components/GenerateDocument';

type PDFGeneratorProps = {
    appliedCourse: CourseType;
};

export default function PDFCourse({ appliedCourse }: PDFGeneratorProps) {
    const [instance] = usePDF({ document: generateDocument(appliedCourse.modules.map(m => m.module)) });

    let startDay = new Date(appliedCourse.startDate).getDate().toString();
    if (startDay.length == 1)
        startDay = "0" + startDay;
    let startMonth = new Date(appliedCourse.startDate).getMonth().toString();
    if (startMonth.length == 1)
        startMonth = "0" + startMonth;

    let endDay = new Date(appliedCourse.endDate!).getDate().toString();
    if (endDay.length == 1)
        endDay = "0" + endDay;
    let endMonth = new Date(appliedCourse.endDate!).getMonth().toString();
    if (endMonth.length == 1)
        endMonth = "0" + endMonth;

    const documentName = "CourseOverview_" + appliedCourse.name + "_" + startDay + startMonth + new Date(appliedCourse.startDate).getFullYear() + "_" + endDay + endMonth + new Date(appliedCourse.endDate!).getFullYear() + ".pdf";

    return (
        <button className="btn py-1 max-w-xs text-white min-w-52 text-xl">
            <a className="pr-2 flex items-center gap-2" href={instance.url!} download={documentName}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Course PDF
            </a>
        </button>
    );
}
