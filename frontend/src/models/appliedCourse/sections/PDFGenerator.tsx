import { usePDF } from '@react-pdf/renderer';
import { CourseType } from '@models/course/Types';
import { generateDocument } from '../components/GenerateDocument';

type PDFGeneratorProps = {
    appliedCourse: CourseType;
};

export default function PDFGenerator({ appliedCourse }: PDFGeneratorProps) {
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
        <button className="btn btn-sm py-1 max-w-xs btn-primary text-white">
            <a href={instance.url!} download={documentName}>
                Create PDF - Complete Overview
            </a>
        </button>
    );
}
