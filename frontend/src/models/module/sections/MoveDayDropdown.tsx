import React, { useState } from 'react';
import EllipsisBtn from '../components/EllipsisBtn';
import ModalContainer from '../components/ModalContainer';
import { DayType, ModuleType } from '../Types';
import { openCloseModal } from '../helpers/openCloseModal';
import { useMutationUpdateModule } from '@api/module/moduleMutations';


function MoveDayDropdown({
    editTrue,
    dayNumber,
    modules,
    moduleId,
    selectedModule,
    selectedModuleDay,
    handleSelectModule,
    handleSelectModuleDay,
    setSelectedModule,
    setSelectedModuleDay,
    setNumOfDays,
    setDays,
    day,
    days
}: MoveDayDropdownProps) {

    const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);
    const mutationUpdateModule = useMutationUpdateModule();


    const setAllToFalse = () => {
        setIsIncompleteInput(false);
        setSelectedModule("DEFAULT");
        setSelectedModuleDay("DEFAULT");
    }


    const handleMove = () => {
        setIsIncompleteInput(false);
        const originalDays = modules?.find(m => m.id == parseInt(selectedModule))?.days;
        const module = modules?.find(m => m.id == parseInt(selectedModule));
        if (originalDays && module && selectedModuleDay != "DEFAULT") {
            const editedDaysCurrent = [...days];
            editedDaysCurrent.splice(day.dayNumber - 1, 1);
            for (let i = day.dayNumber - 1; i < editedDaysCurrent.length; i++) {
                editedDaysCurrent[i].dayNumber = i + 1;
            }
            setNumOfDays(days.length - 1);
            setDays(editedDaysCurrent);

            const editedDays = [...originalDays];
            editedDays.splice(parseInt(selectedModuleDay) - 1, 0, day);
            for (let i = parseInt(selectedModuleDay) - 1; i < editedDays.length; i++) {
                editedDays[i].dayNumber = i + 1;
            }

            const newModule: ModuleType = {
                id: module.id,
                name: module.name,
                numberOfDays: module.numberOfDays + 1,
                days: editedDays
            };
            mutationUpdateModule.mutate(newModule);
            if (mutationUpdateModule.isSuccess) {
                setAllToFalse();
            }
        }
        else {
            setIsIncompleteInput(true);
        }
    };

    return (
        editTrue && (
            <div className="dropdown">
                <EllipsisBtn />
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-60 p-2 shadow">
                    <ModalContainer openModalText={"Move Day to another Module"} setAllToFalse={setAllToFalse} id={`${dayNumber - 1}`}>
                        <h2 className="m-2 self-center">To which module do you want to move this event?</h2>
                        <div className="flex flex-col self-center">
                            <select
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                onChange={handleSelectModule}
                                className="border border-gray-300 rounded-lg p-1 w-fit"
                                defaultValue="DEFAULT"
                            >
                                <option value="DEFAULT" disabled>Select Module</option>
                                {modules?.map((module) => (
                                    module.id !== moduleId && (
                                        <option key={module.id} value={module.id}>{module.name}</option>
                                    )
                                ))}
                            </select>
                        </div>
                        {selectedModule !== "DEFAULT" && (
                            <div className="flex flex-col items-center">
                                <h2 className="m-2 self-center">To which day of this module do you want to move this event?</h2>
                                <div className="flex flex-col self-center">
                                    <select
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={handleSelectModuleDay}
                                        className="border border-gray-300 rounded-lg p-1 w-fit"
                                        defaultValue="DEFAULT"
                                    >
                                        <option value="DEFAULT" disabled>Select Day</option>
                                        {modules?.find(m => m.id === parseInt(selectedModule))?.days.map((dayOption) => (
                                            <option key={dayOption.id} value={dayOption.dayNumber}>Day {dayOption.dayNumber}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        {selectedModule !== "DEFAULT" && selectedModuleDay !== "DEFAULT" && (
                            <>
                                <h2 className="mt-4 self-center font-bold">Moving this day will save all changes!</h2>
                                <h2 className="mt-4 self-center font-bold">If this module is part of a course, the course will also be modified!</h2>
                            </>
                        )}
                        <div className="flex items-center justify-center mb-4 gap-2">
                            <button
                                className="btn btn-sm mt-4 w-40 btn-success text-white"
                                type="button"
                                onClick={() => {
                                    handleMove();
                                    openCloseModal("close", setAllToFalse, `${dayNumber - 1}`);
                                    setSelectedModule("DEFAULT");
                                    setSelectedModuleDay("DEFAULT");
                                }}
                            >Move Day and Save</button>
                            <button
                                className="btn btn-sm mt-4 w-24 btn-error text-white"
                                type="button"
                                onClick={() => openCloseModal("close", setAllToFalse, `${dayNumber - 1}`)}
                            >Cancel</button>
                        </div>
                        {isIncompleteInput && (
                            <p className="error-message text-red-600 text-sm mb-4 self-center" id="invalid-helper">Please select a module and a day</p>
                        )}
                    </ModalContainer>
                </ul>
            </div>
        )
    );
}

export interface MoveDayDropdownProps {
    editTrue: boolean,
    dayNumber: number,
    modules: ModuleType[] | undefined,
    moduleId: number,
    selectedModule: string,
    selectedModuleDay: string,
    handleSelectModule: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    handleSelectModuleDay: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    setSelectedModule: (value: React.SetStateAction<string>) => void,
    setSelectedModuleDay: (value: React.SetStateAction<string>) => void,
    setNumOfDays: React.Dispatch<React.SetStateAction<number>>,
    setDays: (value: React.SetStateAction<DayType[]>) => void,
    day : DayType,
    days : DayType[]
}

export default MoveDayDropdown;