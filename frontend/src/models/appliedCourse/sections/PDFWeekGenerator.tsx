import React, { useEffect, useState } from 'react';
import { usePDF } from '@react-pdf/renderer';
import { generateDocument } from '../components/GenerateDocument';
import { CourseType, ModuleType } from '@models/course/Types';

type PDFWeekGeneratorProps = {
    appliedCourse: CourseType;
};

export default function PDFWeekGenerator({ appliedCourse }: PDFWeekGeneratorProps) {
    const [selectedModule, setSelectedModule] = useState<string>("DEFAULT");
    const [selectedModuleObject, setSelectedModuleObject] = useState<ModuleType>();
    const [documentName, setDocumentName] = useState<string>("");
    const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);
    const [instance, updateInstance] = usePDF();

    useEffect(() => {
        if (selectedModuleObject) {
            updateInstance(generateDocument([selectedModuleObject]));
        }
    }, [selectedModuleObject, updateInstance]);

    const handleSelectModule = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedModule(value);

        const module = appliedCourse.modules.find(m => m.module.id == parseInt(value))?.module;
        if (module) {
            setSelectedModuleObject(module);
            setDocumentName("ModuleOverview_" + appliedCourse.name + "_" + module.name + ".pdf");
        }
    };

    const setAllToFalse = () => {
        setIsIncompleteInput(false);
        setSelectedModule("DEFAULT");
    }

    function handlePDFModalOverview(state: string) {
        const modal = document.getElementById('pdf-modal-overview') as HTMLDialogElement;
        return state === "open"
            ? modal.showModal()
            : modal.close();
    }

    return (
        <>
            <button className="btn btn-sm py-1 max-w-xs btn-primary text-white" onClick={() => handlePDFModalOverview("open")}>
                Create PDF - Module Overview
            </button>
            <dialog id="pdf-modal-overview" className="modal">
                <div className="modal-box flex flex-col items-center gap-4">
                    <h2 className="m-2 self-center">For which module do you want to create a PDF?</h2>
                    <div className="flex flex-col self-center">
                        <select onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} onChange={handleSelectModule} className="border border-gray-300 rounded-lg p-1 w-fit" defaultValue={'DEFAULT'}>
                            <option key={"default"} value="DEFAULT" disabled>Select Module</option>
                            {appliedCourse.modules.map((module, moduleIndex) =>
                                <option key={module.module.id + ":" + moduleIndex} value={module.module.id}>{module.module.name}</option>
                            )}
                        </select>
                    </div>
                    <div className="flex items-center justify-center mb-4 gap-2">
                        {selectedModule !== "DEFAULT"
                            ? <button className="btn btn-sm mt-4 w-40 btn-success text-white" onClick={() => setAllToFalse()}>
                                <a href={instance.url!} download={documentName}>
                                    Create PDF
                                </a>
                            </button>
                            : <button className="btn btn-sm mt-4 w-40 btn-success text-white" onClick={() => setIsIncompleteInput(true)}>
                                Create PDF
                            </button>
                        }
                        <button className="btn btn-sm mt-4 w-24 btn-error text-white" onClick={() => { setAllToFalse(); handlePDFModalOverview("close") }}>Cancel</button>
                    </div>
                    {isIncompleteInput && (
                        <p className="error-message text-red-600 text-sm mb-4 self-center" id="invalid-helper">Please select a module</p>
                    )}
                    <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => handlePDFModalOverview("close")}>✕</button>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}
