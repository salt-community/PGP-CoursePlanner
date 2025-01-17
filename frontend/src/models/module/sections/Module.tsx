import InputSmall from "@components/inputFields/InputSmall";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import SuccessBtn from "@components/buttons/SuccessBtn";
import { useNavigate } from "react-router-dom";
import { useState, FormEvent, useEffect, useRef } from "react";
import { ModuleProps, DayType, ModuleType, EventType } from "../Types";
import Day from "./Day";
import { useMutationPostModule, useMutationUpdateModule } from "@api/module/moduleMutations";

export default function Module({ module, buttonText }: ModuleProps) {
    const navigate = useNavigate();
    const [moduleName, setModuleName] = useState<string>(module.name);
    const [numOfDays, setNumOfDays] = useState<number>(module.days.length);
    const [days, setDays] = useState<DayType[]>(module.days);
    const [track, setTrack] = useState<string[]>(module.track || [".NET"]);
    const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const mutationPostModule = useMutationPostModule();
    const mutationUpdateModule = useMutationUpdateModule("/modules");

    const handleDays = () => {
        const editedDays = days.slice();
        if (numOfDays < days.length) {
            editedDays.splice(numOfDays, days.length - numOfDays);
        }
        else {
            const numOfDaysArray = ([...Array(numOfDays - days.length).keys()].map(i => i + 1));

            numOfDaysArray.map((num) => {
                const newDay = {
                    dayNumber: num + days.length,
                    description: "",
                    events: []
                };

                editedDays.push(newDay);
            });
        }
        setDays(editedDays);
    };

    const handleTrackChange = (selectedTrack: string) => {
        if (track.includes(selectedTrack)) {
            setTrack(track.filter(t => t !== selectedTrack));
        } else {
            setTrack([...track, selectedTrack]);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { moduleName } = e.target as typeof e.target & { moduleName: { value: string } };
        const { numberOfDays } = e.target as typeof e.target & { numberOfDays: { value: number } };
        const events: EventType[] = [];
        days.forEach(day => {
            const eventsOfDay = day.events;
            eventsOfDay.forEach(event => {
                events.push(event);
            });
        });

        setIsIncompleteInput(false);
        if (isStringInputIncorrect(moduleName.value) || numberOfDays.value == 0 || days.some(d => d.description == "") || events.some(e => e.name == "") || events.some(e => e.startTime == "") || events.some(e => e.endTime == "")) {
            setIsIncompleteInput(true);
        } else {
            const newModule: ModuleType = {
                id: module.id ?? 0,
                name: moduleName.value.trim(),
                numberOfDays: numberOfDays.value,
                days: days,
                track: track
            };
            if (module.id == 0) {
                mutationPostModule.mutate(newModule);
            } else {
                mutationUpdateModule.mutate(newModule);
            }
        }
    }

    const isStringInputIncorrect = (str: string) => {
        const strNoSpace = str.replaceAll(" ", "");
        if (strNoSpace.length > 0)
            return false;
        else
            return true;
    }

    function handleClick() {
        const dropdownMenu = document.getElementById('dropdownMenu')!;
        if (dropdownMenu.className.includes('block')) {
            dropdownMenu.classList.add('hidden')
            dropdownMenu.classList.remove('block')
        } else {
            dropdownMenu.classList.add('block')
            dropdownMenu.classList.remove('hidden')
        }
    }

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                dropdownRef.current.classList.add('hidden');
                dropdownRef.current.classList.remove('block');
            }
        }
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <section className="px-4 pb-10 md:px-24 lg:px-56">
            <form id="editCourse-form" onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <div className="flex flex-col justify-between">
                    <div className="flex flex-row items-center">
                        <h2 className="self-start mt-2 w-1/4 text-lg mb-2">Module Name: </h2>
                        <div className="w-3/4">
                            <InputSmall
                                type="text"
                                name="moduleName"
                                onChange={(e) => setModuleName(e.target.value)}
                                placeholder="Module name"
                                value={moduleName}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <h2 className="self-start mt-2 w-1/4 text-lg mb-2">Number of days:</h2>
                        <input
                            type="number"
                            name="numberOfDays"
                            onChange={(e) => setNumOfDays(parseInt(e.target.value))}
                            value={numOfDays.toString()}
                            min="0"
                            className="input input-bordered input-sm w-3/5 mr-4"
                            placeholder="Number of days"
                        />
                    </div>
                    <div className="flex flex-row items-center">
                        <h2 className="self-start mt-2 w-1/4 text-lg mb-2">Track(s):</h2>
                        <div className="relative w-3/5 mr-4">
                            {track.length > 0
                                ? <button ref={buttonRef} type="button" id="dropdownToggle" onClick={handleClick} className="h-8 text-start pl-3 text-sm w-full border rounded-lg border-gray-300">
                                    {track.join(", ")}
                                </button>
                                : <button ref={buttonRef} type="button" id="dropdownToggle" onClick={handleClick} className="h-8 text-start pl-3 text-sm w-full border rounded-lg border-gray-300">
                                    Select
                                </button>
                            }

                            <ul ref={dropdownRef} id="dropdownMenu" className='absolute hidden bg-neutral rounded-lg py-2 px-2 z-[1000] w-full shadow'>
                                <li>
                                    <label className="flex flex-row gap-2">
                                        <input
                                            type="checkbox"
                                            value=".NET"
                                            checked={track.includes(".NET")}
                                            onChange={(e) => handleTrackChange(e.target.value)}
                                        />
                                        <h1 className="text-md">.NET</h1>
                                    </label>
                                </li>
                                <li>
                                    <label className="flex flex-row gap-2">
                                        <input
                                            type="checkbox"
                                            value="Javascript"
                                            checked={track.includes("Javascript")}
                                            onChange={(e) => handleTrackChange(e.target.value)}
                                        />
                                        <h1 className="text-md">Javascript</h1>
                                    </label>
                                </li>
                                <li >
                                    <label className="flex flex-row gap-2">
                                        <input
                                            type="checkbox"
                                            value="Java"
                                            checked={track.includes("Java")}
                                            onChange={(e) => handleTrackChange(e.target.value)}
                                        />
                                        <h1 className="text-md">Java</h1>
                                    </label>
                                </li>
                            </ul>
                        </div>

                        <PrimaryBtn onClick={handleDays}>Apply</PrimaryBtn>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    {days.map((day) =>
                        <Day key={"day_" + day.dayNumber} editTrue={module.id ? true : false} moduleId={module.id!} setDays={setDays} days={days} day={day} setNumOfDays={setNumOfDays} />)}
                </div>
                {isIncompleteInput &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Please fill in all the fields</p>}
                <div className="flex flex-row gap-2">
                    <SuccessBtn value={buttonText}></SuccessBtn>
                    <button onClick={() => navigate(`/modules/details/${module.id}`)} className="btn btn-sm mt-4 max-w-66 btn-info text-white">Go back without saving changes</button>
                </div>
            </form>
        </section>
    );
}
