import { format } from "date-fns";
import { today } from "@helpers/dateHelpers";
import LoadingSkeletonDay from "../components/LoadingSkeletonDay";
import { CalendarDateType, DateContent } from "@api/Types";

type Props = {
    dateContent: DateContent[];
    date: string;
    indexForModal: number;
    openModal: (index: number) => void;
    isLoading: boolean
    data: CalendarDateType[] | undefined
}

export default function CalenderDate({ dateContent, date, openModal, indexForModal, isLoading, data }: Props) {

    const border = "border-[0.5px] border-gray-100";
    const text = today == date ? "font-bold text-[#EC0E40]" : "";
    const bg = today == date ? "bg-[#FFAEC0]" : "";

    const appliedCourseIds: number[] = [];
    const appliedCourseColors: string[] = [];
    const appliedModules: string[] = []
    dateContent.forEach(dc => {
        if (appliedCourseIds.filter(id => id == dc.appliedCourseId!).length == 0) {
            appliedCourseIds.push(dc.appliedCourseId!)
            appliedCourseColors.push(dc.color!)
            if (dc.moduleName != null) {

                if (dc.dayOfModule != 0) {
                    appliedModules.push(dc.moduleName! + ` day (${dc.dayOfModule}/${dc.totalDaysInModule})`)
                }
                else {
                    appliedModules.push("Weekend")
                }
            }
        }
    });

    return (
        <button onClick={() => openModal(indexForModal)}
            className={`bg-white ${border} flex flex-col gap-2 p-4 pt-1 pb-2 items-center h-full ${(isLoading || !data) ? "cursor-default pointer-events-none" : "hover:bg-[#F9F9F9] hover:cursor-pointer"}`}>
            <div className={`${bg} h-10 w-10 rounded-full flex justify-center items-center`}>
                <h2 className={`${text}`}>
                    {format(date, 'd')}
                </h2>
            </div>
            <div className="flex flex-col gap-1 w-full">
                {isLoading ? (
                    <LoadingSkeletonDay />
                ) :
                    <>
                        {appliedCourseColors.length > 0 && appliedCourseColors.map((color, appliedCourseIndex) => (
                            <div
                                key={appliedCourseIndex}
                                style={{ backgroundColor: color }}
                                className="flex justify-center items-center w-full h-5 text-sm text-white text-clip overflow-hidden whitespace-nowrap rounded-md"
                            >
                                <p>{appliedModules[appliedCourseIndex]}</p>
                            </div>
                        ))
                        }
                    </>
                }
            </div>
        </button>
    )
}