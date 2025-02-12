import { format } from "date-fns";
import { today } from "@helpers/dateHelpers";
import LoadingSkeletonMonth from "@models/calendar/components/LoadingSkeletonDay";
import { CourseType, ModuleType } from "../../../api/Types";
import { DateContent } from "@models/calendar/Types";



type Props = {
    dateContent: DateContent[];
    date: string;
    indexForModal: number;
    openModal: (index: number) => void;
    isLoading: boolean;
    isInSelectedModule: boolean,
    isSelectedModuleStartDate: boolean
    previewCourse: CourseType
    setSelectedModule: React.Dispatch<React.SetStateAction<ModuleType>>
    handleMoveModuleDnd: (moduleId: number, newDate: string) => void;
}

export default function CalenderDate({ dateContent, date, openModal, indexForModal, isLoading, isInSelectedModule, isSelectedModuleStartDate, previewCourse, setSelectedModule, handleMoveModuleDnd }: Props) {

    let border = "border-[0.5px] border-gray-100";
    const text = today == date ? "font-bold text-[#EC0E40]" : "";
    const bg = today == date ? "bg-[#FFAEC0]" : "";
    let bgBox = "bg-white"

    if (isSelectedModuleStartDate) {
        border = "border-[0.5px] border-blue-600"
    }

    if (isInSelectedModule) {
        bgBox = "bg-pink-100"
    }


    const updateSelectedModule = (moduleId: number) => {
        console.log(moduleId)
        if (moduleId != null) {
            const newSelectedModule = previewCourse.modules.map(m => m.module).find(m => m.id == moduleId)
            if (newSelectedModule) {
                setSelectedModule(newSelectedModule)
            }
        }
    }
    const handleDragStart = (e: React.DragEvent, moduleId: number) => {
        e.dataTransfer.setData("moduleId", moduleId.toString());
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
    
        const moduleId = Number(e.dataTransfer.getData("moduleId"));
        console.log("Dropping module with ID:", moduleId);
        console.log("Dropping over date:", date);
    
        if (!moduleId) return;
    
        handleMoveModuleDnd(moduleId, date);
    };

    return (
        <button onClick={isLoading ? () => { } : () => openModal(indexForModal)}
            className={`${bgBox} ${border} flex flex-col gap-2 p-4 pt-1 pb-2 items-center h-full ${!isLoading 
            ? "hover:bg-[#F9F9F9] hover:cursor-pointer" : "hover:cursor-default"} ${isInSelectedModule 
            ? "hover:bg-pink-50" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop} 
            >
            <div className={`${bg} h-10 w-10 rounded-full flex justify-center items-center`}>
                <h2 className={`${text}`}>
                    {format(date, 'd')}
                </h2>
            </div>
            <div className="flex flex-col gap-1 w-full">
                {isLoading ? (
                    <LoadingSkeletonMonth />
                ) :
                    <>
                        {dateContent.length > 0 && dateContent.map((dc, index) => (
                            <div
                                key={index}
                                style={{ backgroundColor: dc.color }}
                                className="flex justify-center items-center w-full h-5 text-sm text-white text-clip overflow-hidden whitespace-nowrap rounded-md"
                                draggable
                                onDragStart={(e) => handleDragStart(e, dc.moduleId)}
                                onClick={() => updateSelectedModule(dc.moduleId)}
                            >
                                <p>{dc.moduleName}</p>
                            </div>
                        ))
                        }
                    </>
                }
            </div>
        </button>
    )
}