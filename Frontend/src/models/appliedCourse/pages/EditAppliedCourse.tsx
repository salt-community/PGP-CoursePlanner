import { useMutation, useQuery, useQueryClient } from "react-query";
import Page from "../../../components/Page";
import { getIdFromPath } from "../../../helpers/helperMethods";
import { editAppliedCourse, getAppliedCourseById } from "../../../api/AppliedCourseApi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { SyntheticEvent, useEffect, useRef, useState } from "react";
import Popup from "reactjs-popup";
import ColorBtn from "../../../components/buttons/ColorButton";
import CloseBtn from "../../../components/buttons/CloseBtn";
import ColorSelection from "../../../components/ColorSelection";
import { useNavigate } from "react-router-dom";
import { AppliedCourseType } from "../../course/Types";
import { getCookie } from "../../../helpers/cookieHelpers";
import NavigateToLogin from "../../login/NavigateToLogin";
import AppliedModule from "../sections/AppliedModule";
import InputSmall from "../../../components/inputFields/InputSmall";
import { AppliedModuleType } from "../Types";
import PrimaryBtn from "../../../components/buttons/PrimaryBtn";
import TrashBtn from "../../../components/buttons/TrashBtn";
import { getAllModules } from "../../../api/ModuleApi";
import { postAppliedModule } from "../../../api/AppliedModuleApi";

export default function () {
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);
    const [isInvalidModule, setIsInvalidModule] = useState<boolean>(false);
    const navigate = useNavigate();

    const appliedCourseId = getIdFromPath();

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [color, setColor] = useState<string>("");
    const [appliedCourseName, setAppliedCourseName] = useState<string>("");
    const [appliedModules, setAppliedModules] = useState<AppliedModuleType[]>();

    const { data: modules, } = useQuery({
        queryKey: ['modules'],
        queryFn: getAllModules
    });

    const [appliedCourse, setAppliedCourse] = useState<AppliedCourseType>();
    useEffect(() => {
        getAppliedCourseById(parseInt(appliedCourseId))
            .then(result => { setAppliedCourse(result); setStartDate(new Date(result!.startDate!)); setColor(result!.color!); setAppliedCourseName(result!.name!); setAppliedModules(result!.modules); })
    }, [appliedCourseId]);

    const popupRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsOpened(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    async function editAppliedModule(index: number, appliedModule: AppliedModuleType) {
        const newAppliedModules = [...appliedModules!];
        newAppliedModules[index] = appliedModule;
        setAppliedModules(newAppliedModules);
    }
    
    const handleAddModule = (index: number) => {
        const emptyModule = {
            name: "",
            numberOfDays: 1,
            days: []
        };
        const editedModules = [...appliedModules!];
        editedModules.splice(index + 1, 0, emptyModule);
        setAppliedModules(editedModules);
    }
    
    const handleDeleteModule = (index: number) => {
        const editedModules = [...appliedModules!];
        editedModules.splice(index, 1);
        setAppliedModules(editedModules);
    }
    
    const handleChange = (event: SyntheticEvent) => {
        const value = (event.target as HTMLSelectElement).value;
        const [moduleId, indexStr] = value.split("_"); // Parse index from the selected value
        const moduleIndex = parseInt(indexStr); // Parse index as integer
        const module = modules!.find(m => m.id === parseInt(moduleId))!; // Find the module based on the selected value
        
        const appliedModule: AppliedModuleType = {
            id: module.id,
            name: module.name,
            numberOfDays: module.numberOfDays,
            days: module.days
        };       
        
        postAppliedModule(appliedModule)
        .then(response => {
            if (response) {
                const updatedModules = [...appliedModules!];
                updatedModules[moduleIndex] = response;
                setAppliedModules(updatedModules);
            }
        })
        .catch(error => {
            console.error("Error posting applied module:", error);
        });
    }

    const handleEdit = () => {
        setIsInvalidDate(false);
        setIsInvalidModule(false);
        if (startDate.getDate() == 6 || startDate.getDate() == 0 || appliedModules?.find(m => m.name == "")) {
            if (startDate.getDate() == 6 || startDate.getDate() == 0)
                setIsInvalidDate(true);
            if (appliedModules?.find(m => m.name == ""))
                setIsInvalidModule(true);
        }
        else {
            const newAppliedCourse: AppliedCourseType = {
                name: appliedCourseName,
                id: appliedCourse!.id,
                courseId: appliedCourse?.courseId!,
                startDate: startDate,
                color: color,
                modules: appliedModules!
            };
            mutation.mutate(newAppliedCourse);
            console.log(newAppliedCourse)
        }
    }
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (newAppliedCourse: AppliedCourseType) => {
            return editAppliedCourse(newAppliedCourse);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allAppliedCourses'] })
            navigate(`/activecourses`);
        }
    })
    
    return (
        getCookie("access_token") == undefined
            ? <NavigateToLogin />
            : <Page>
                <section className="px-4 md:px-24 lg:px-56">
                    {appliedCourse !== undefined &&
                        <div>
                            <div className="flex flex-row gap-4 items-center">
                                <div className="self-start mt-2">
                                    <h2 className="text-lg mb-2 w-[150px]">Bootcamp Name: </h2>
                                </div>
                                <InputSmall type="text" name="bootcampName" onChange={(e) => setAppliedCourseName(e.target.value)} placeholder="Module name" value={appliedCourseName} />
                            </div>

                            <div className="flex flex-row gap-4 items-center">
                                <div className="self-start mt-2 w-[150px]">
                                    <h2 className="text-lg mb-2">Start Date: </h2>
                                </div>
                                <DatePicker name="startDate" value={startDate} onChange={(date) => setStartDate(date!)} className="max-w-xs" sx={
                                    {
                                        height: "35px",
                                        padding: "0px",
                                        "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                                            fontFamily: 'Montserrat',
                                            color: "var(--fallback-bc,oklch(var(--bc)/0.7))",
                                            padding: "6px"
                                        }
                                    }
                                } />
                            </div>

                            <Popup
                                open={isOpened}
                                onOpen={() => setIsOpened(true)}
                                trigger={
                                    <div className="flex flex-row gap-4 items-center mb-3">
                                        <div className="self-start mt-2 w-[150px]">
                                            <h2 className="text-lg flex items-center">Color:  </h2>
                                        </div>
                                        <div style={{ backgroundColor: color }} className="w-5 h-5 ml-2"></div>
                                    </div>
                                }
                                modal
                            >
                                {
                                    <div ref={popupRef}>

                                        <div className="flex flex-col">
                                            <div className="flex justify-end">
                                                <CloseBtn onClick={() => setIsOpened(false)} />
                                            </div>
                                            <div className="self-center mt-2 mb-4">
                                                <ColorSelection color={color} setColor={setColor}></ColorSelection>
                                            </div>
                                            <div className="self-center mb-4">
                                                <ColorBtn onClick={() => setIsOpened(false)} color={color}>Select color</ColorBtn>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </Popup>


                            {modules && appliedModules && appliedModules.map((appliedModule, index) =>
                                <>
                                    {appliedModule.name == ""
                                        ? <div className="collapse border-primary border mb-2">
                                            <input type="checkbox" id={`collapse-toggle-${index}`} className="hidden" />
                                            <div className="collapse-title flex flex-row w-full gap-4">
                                                <label htmlFor={`collapse-toggle-${index}`} className="cursor-pointer flex flex-row">
                                                    <h1 className="text-lg text-primary">
                                                        Module {index + 1}:
                                                    </h1>
                                                </label>
                                                <div className="flex flex-col">
                                                    <select className="border border-gray-300 rounded-lg p-1 w-48" onChange={handleChange} defaultValue={'DEFAULT'} >
                                                        <option value="DEFAULT" disabled>Select</option>
                                                        {modules.map((module) =>
                                                            <option value={`${module.id}_${index}`}>{module.name} ({module.numberOfDays} days)</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        : <div className="collapse border-primary border mb-2 w-full">
                                            <input type="checkbox" id={`collapse-toggle-${index}`} className="hidden" />
                                            <div className="collapse-title flex flex-row w-full gap-4">
                                                <label htmlFor={`collapse-toggle-${index}`} className="cursor-pointer flex flex-row">
                                                    <h1 className="text-lg text-primary w-[680px]">
                                                        Module {index + 1}: {appliedModule.name}
                                                    </h1>
                                                </label>
                                                <div className="flex gap-1">
                                                    <PrimaryBtn onClick={() => handleAddModule(index)}>+</PrimaryBtn>
                                                    <TrashBtn handleDelete={() => handleDeleteModule(index)} />
                                                </div>
                                            </div>
                                            <div className="collapse-content w-full">
                                                <AppliedModule module={appliedModule} index={index} submitFunction={editAppliedModule} buttonText="Save module changes" />
                                            </div>
                                        </div>}
                                </>
                            )}

                            {isInvalidDate &&
                                <p className="error-message text-red-600 text-sm mt-4" id="invalid-helper">Please select a weekday for the start date</p>}
                            {isInvalidModule &&
                                <p className="error-message text-red-600 text-sm mt-4" id="invalid-helper">Please select a module</p>}
                            <button onClick={handleEdit} className="btn btn-sm mt-6 max-w-48 btn-success text-white">Save all changes</button>
                        </div>
                    }
                </section>
            </Page >
    )
}