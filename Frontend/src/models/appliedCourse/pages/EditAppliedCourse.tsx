import { useMutation, useQueryClient } from "react-query";
import Page from "../../../components/Page";
import { getIdFromPath } from "../../../helpers/helperMethods";
import { editAppliedCourse, getAppliedCourseById } from "../../../api/AppliedCourseApi";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useEffect, useRef, useState } from "react";
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

export default function () {
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);
    const navigate = useNavigate();

    const appliedCourseId = getIdFromPath();

    const [startDate, setStartDate] = useState<Date>(new Date());
    const [color, setColor] = useState<string>("");
    const [appliedCourseName, setAppliedCourseName] = useState<string>("");
    const [appliedModules, setAppliedModules] = useState<AppliedModuleType[]>();

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

    const handleEdit = () => {
        setIsInvalidDate(false);
        if (startDate.getDate() == 6 || startDate.getDate() == 0)
            setIsInvalidDate(true);
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

    async function editAppliedModule(index: number, appliedModule: AppliedModuleType) {
        var newAppliedModules = appliedModules!;
        newAppliedModules[index] = appliedModule;
        setAppliedModules(newAppliedModules);
    }

    return (
        getCookie("access_token") == undefined
            ? <NavigateToLogin />
            : <Page>
                <section className="px-4 md:px-24 lg:px-56">
                    {appliedCourse !== undefined &&
                        <div>
                            <div className="flex flex-row gap-4 items-center">
                                <div className="self-start mt-2">
                                    <h2 className="text-lg mb-2 w-[150px]">Course Name: </h2>
                                </div>
                                <InputSmall type="text" name="moduleName" onChange={(e) => setAppliedCourseName(e.target.value)} placeholder="Module name" value={appliedCourseName} />
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

                            {appliedModules && appliedModules.map((appliedModule, index) =>
                                <div className="collapse border-base-300 bg-base-200 border">
                                    <input type="checkbox" id={`collapse-toggle-${index}`} />
                                    <div className="collapse-title text-xl font-medium">Module {index + 1}: {appliedModule.name}</div>
                                    <div className="collapse-content w-full">
                                        <AppliedModule module={appliedModule} index={index} submitFunction={editAppliedModule} buttonText="Save module changes" />
                                    </div>
                                </div>)}

                            {isInvalidDate &&
                                <p className="error-message text-red-600 text-sm mt-4" id="invalid-helper">Please select a weekday for the start date</p>}
                            <button onClick={handleEdit} className="btn btn-sm mt-6 max-w-48 btn-success text-white">Save all changes</button>
                        </div>
                    }
                </section>
            </Page >
    )
}