import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useEffect, useState } from "react";
import { useQueryAppliedCourseById } from "@api/appliedCourse/appliedCourseQueries";
import { useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";
import PrimaryBtn from "@components/buttons/PrimaryBtn";
import { ModuleType } from "@models/course/Types";

export default function EditAppliedCourse() {
    const appliedCourseId = useIdFromPath();
    const { data: appliedCourse, isLoading, isError } = useQueryAppliedCourseById(appliedCourseId);
    const mutationUpdateAppliedCourse = useMutationUpdateAppliedCourse();

    const [courseName, setCourseName] = useState<string>("");
    const [appliedModules, setAppliedModules] = useState<ModuleType[]>([]);
    const [moduleNames, setModuleNames] = useState<Record<number, string>>({});
    const [visibleModules, setVisibleModules] = useState<Set<number>>(new Set());
    const [visibleDays, setVisibleDays] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (appliedCourse) {
            setCourseName(appliedCourse.name);
            setAppliedModules(appliedCourse.modules); 
            const initialNames = Object.fromEntries(
                appliedCourse.modules.map((module) => [module.moduleId!, module.module?.name || ""])
            );
            setModuleNames(initialNames);
        }
    }, [appliedCourse]);

    const handleCreateNewAppliedModule = () => {
        const newModule: ModuleType = {
            moduleId: 0, 
            module: {
                name: "",
                order: 0,
                days: [],
            }
        };
        setAppliedModules((prevModules) => [...prevModules, newModule]);
    };

    const toggleModuleVisibility = (moduleId: number) => {
        setVisibleModules((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(moduleId)) {
                newSet.delete(moduleId);
            } else {
                newSet.add(moduleId);
            }
            return newSet;
        });
    };

    const toggleDayVisibility = (dayId: number) => {
        setVisibleDays((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(dayId)) {
                newSet.delete(dayId);
            } else {
                newSet.add(dayId);
            }
            return newSet;
        });
    };

    const handleModuleNameChange = (moduleId: number, newName: string) => {
        setModuleNames((prev) => ({
            ...prev,
            [moduleId]: newName,
        }));
    };

    const handleUpdateCourse = () => {
        if (appliedCourse) {
            const updatedModules = appliedModules.map((module) => ({
                ...module,
                module: {
                    ...module.module,
                    name: moduleNames[module.moduleId!] || module.module?.name,
                },
            }));

            mutationUpdateAppliedCourse.mutate({
                ...appliedCourse,
                name: courseName,
                modules: updatedModules,
            });
        }
    };

    if (isLoading) {
        return <p>Loading course data...</p>;
    }

    if (isError || !appliedCourse) {
        return <p>There was an error loading the course data.</p>;
    }

    return (
        <Page>
            <section className="px-4 md:px-24 lg:px-56">
                <button onClick={handleUpdateCourse}>Save</button>
                <div>
                    <label>
                        Course Name:
                        <input
                            type="text"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            style={{ marginLeft: "10px", padding: "5px", border: "1px solid gray" }}
                        />
                    </label>
                </div>
                <div>
                    {appliedModules.map((module) => (
                        <div key={module.moduleId} style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
                            <div onClick={() => toggleModuleVisibility(module.moduleId!)} style={{ cursor: "pointer" }}>
                                <h2 style={{ textAlign: "center" }}>
                                    {moduleNames[module.moduleId!] || "New Module"}
                                </h2>
                            </div>

                            {visibleModules.has(module.moduleId!) && (
                                <div>
                                    <p>
                                        <label>
                                            Module Name:
                                            <input
                                                type="text"
                                                value={moduleNames[module.moduleId!] || ""}
                                                onChange={(e) => handleModuleNameChange(module.moduleId!, e.target.value)}
                                                style={{ marginLeft: "10px", padding: "5px", border: "1px solid gray" }}
                                            />
                                        </label>
                                    </p>
                                    <p>Order: {module.module?.order}</p>
                                    <p><strong>Days:</strong></p>
                                    {module.module?.days.map((day) => (
                                        <div key={day.id} style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
                                            <div onClick={() => toggleDayVisibility(day.id)} style={{ cursor: "pointer" }}>
                                                <h3>{day.description}</h3>
                                            </div>

                                            {visibleDays.has(day.id) && (
                                                <div>
                                                    <p>Day: {day.dayNumber}</p>

                                                    {day.events && day.events.length > 0 && (
                                                        <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
                                                            <strong>Events:</strong>
                                                            {day.events.map((event) => (
                                                                <div key={event.id}>
                                                                    <p>{event.name}</p>
                                                                    <p>Start: {event.startTime}</p>
                                                                    <p>End: {event.endTime}</p>
                                                                    <p>{event.description}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <PrimaryBtn onClick={handleCreateNewAppliedModule}>+</PrimaryBtn>
                </div>
            </section>
        </Page>
    );
}
