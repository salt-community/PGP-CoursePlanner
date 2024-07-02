import { FormEvent, useState } from "react";
import Day from "../day/Day";
import { DayType } from "../day/Types";
import { ModuleProps, ModuleType } from "./Types";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { EventType } from "../event/Types";
import InputSmall from "../../components/inputFields/InputSmall";
import PrimaryBtn from "../../components/buttons/PrimaryBtn";
import SuccessBtn from "../../components/buttons/SuccessBtn";

export default function Module({ submitFunction, module, buttonText }: ModuleProps) {
    const navigate = useNavigate();
    const [moduleName, setModuleName] = useState<string>(module.name);
    const [numOfDays, setNumOfDays] = useState<number>(module.days.length);
    const [days, setDays] = useState<DayType[]>(module.days);
    const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);

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

                editedDays.push(newDay)
            })

        }
        setDays(editedDays);
    }

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (module: ModuleType) => {
            return submitFunction(module);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['modules'] })
            navigate(`/modules`)
        }
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { moduleName } = e.target as typeof e.target & { moduleName: { value: string } };
        const { numberOfDays } = e.target as typeof e.target & { numberOfDays: { value: number } };
        const events: EventType[] = [];
        days.forEach(day => {
            var eventsOfDay = day.events;
            eventsOfDay.forEach(event => {
                events.push(event);
            })
        });

        setIsIncompleteInput(false);
        if (moduleName.value == "" || numberOfDays.value == 0 || days.some(d => d.description == "") || events.some(e => e.name == "") || events.some(e => e.startTime == "") || events.some(e => e.endTime == "")) {
            setIsIncompleteInput(true);
        }
        else {
            const newModule: ModuleType = {
                id: module.id ?? 0,
                name: moduleName.value,
                numberOfDays: numberOfDays.value,
                days: days
            };

            mutation.mutate(newModule);
        }
    }

    return (
        <section className="px-4 md:px-24 lg:px-56">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                <div className="w-auto flex justify-between space-x-2">
                    <InputSmall type="text" name="moduleName" onChange={(e) => setModuleName(e.target.value)} placeholder="Module name" value={moduleName} />
                    <input type="number" name="numberOfDays" onChange={(e) => setNumOfDays(parseInt(e.target.value))} value={numOfDays} className="input input-bordered input-sm max-w-xs" placeholder="Number of days" />
                    <PrimaryBtn onClick={handleDays}>Apply</PrimaryBtn>
                </div>
                <div className="flex flex-col space-y-2">
                    {days.map((day) =>
                        <Day key={"day_" + day.dayNumber} setDays={setDays} days={days} day={day} setNumOfDays={setNumOfDays} />)}
                </div>
                {isIncompleteInput &&
                    <p className="error-message text-red-600 text-sm" id="invalid-helper">Please fill in all the fields</p>}

                <SuccessBtn value={buttonText} />
            </form>
        </section>
    )
}

// import { FormEvent, useState } from "react";
// import Day from "../day/Day";
// import { DayType } from "../day/Types";
// import { ModuleProps, ModuleType } from "./Types";
// import PrimaryBtn from "../../components/buttons/PrimaryBtn";
// import SuccessBtn from "../../components/buttons/SuccessBtn";
// import InputSmall from "../../components/inputFields/InputSmall";
// import { useMutation, useQueryClient } from "react-query";
// import { useNavigate } from "react-router-dom";
// import { EventType } from "../event/Types";

// export default function Module({ submitFunction, module, buttonText }: ModuleProps) {
//     const navigate = useNavigate();
//     const [moduleName, setModuleName] = useState<string>(module.name);
//     const [numOfDays, setNumOfDays] = useState<number>(module.days.length);
//     const [days, setDays] = useState<DayType[]>(module.days);
//     const [isIncompleteInput, setIsIncompleteInput] = useState<boolean>(false);

//     const handleDays = () => {
//         const editedDays = days.slice();
//         if (numOfDays < days.length) {
//             editedDays.splice(numOfDays, days.length - numOfDays);
//         }

//         else {
//             const numOfDaysArray = ([...Array(numOfDays - days.length).keys()].map(i => i + 1));

//             numOfDaysArray.map((num) => {
//                 const newDay = {
//                     dayNumber: num + days.length,
//                     description: "",
//                     events: []
//                 };

//                 editedDays.push(newDay)
//             })

//         }
//         setDays(editedDays);
//     }

//     const queryClient = useQueryClient();

//     const mutation = useMutation({
//         mutationFn: (module: ModuleType) => {
//             return submitFunction(module);
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['modules'] })
//             navigate(`/modules`)
//         }
//     })

//     const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         const { moduleName } = e.target as typeof e.target & { moduleName: { value: string } };
//         const { numberOfDays } = e.target as typeof e.target & { numberOfDays: { value: number } };
//         const events: EventType[] = [];
//         days.forEach(day => {
//             var eventsOfDay = day.events;
//             eventsOfDay.forEach(event => {
//                 events.push(event);
//             })
//         });

//         setIsIncompleteInput(false);
//         if (moduleName.value == "" || numberOfDays.value == 0 || days.some(d => d.description == "") || events.some(e => e.name == "") || events.some(e => e.startTime == "") || events.some(e => e.endTime == "")) {
//             setIsIncompleteInput(true);
//         }
//         else {
//             const newModule: ModuleType = {
//                 id: module.id ?? 0,
//                 name: moduleName.value,
//                 numberOfDays: numberOfDays.value,
//                 days: days
//             };

//             mutation.mutate(newModule);
//         }
//     }

//     return (
//         <section className="px-4 md:px-24 lg:px-56">
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
//                 <div className="w-auto flex justify-between space-x-2">
//                     <InputSmall type="text" name="moduleName" onChange={(e) => setModuleName(e.target.value)} placeholder="Module name" value={moduleName} />
//                     <input type="number" name="numberOfDays" onChange={(e) => setNumOfDays(parseInt(e.target.value))} value={numOfDays} className="input input-bordered input-sm max-w-xs" placeholder="Number of days" />
//                     <PrimaryBtn onClick={handleDays}>Apply</PrimaryBtn>
//                 </div>
//                 <div className="flex flex-col space-y-2">
//                     {days.map((day) =>
//                         <Day key={"day_" + day.dayNumber} setDays={setDays} days={days} day={day} setNumOfDays={setNumOfDays} />)}
//                 </div>
//                 {isIncompleteInput &&
//                     <p className="error-message text-red-600 text-sm" id="invalid-helper">Please fill in all the fields</p>}

//                 <SuccessBtn value={buttonText} />
//             </form>
//         </section>
//     )
// }