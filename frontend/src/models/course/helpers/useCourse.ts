import { useState, useEffect } from "react";
import { ModuleType } from "@models/module/Types";
import { useQueryModules } from "@api/module/moduleQueries";
import { useQueryModulesByCourseId } from "@api/course/courseQueries";

export function useCourse(courseId: number) {
    const [filteredModules, setFilteredModules] = useState<ModuleType[]>([]);
    const [tracks, setTracks] = useState<string[]>([]);
    const [courseModules, setCourseModules] = useState<ModuleType[]>([]);
    const { data: modules } = useQueryModules();
    const { data: courseModulesData } = useQueryModulesByCourseId(courseId);

    useEffect(() => {
        if (modules) {
            setFilteredModules(modules);
            const uniqueTracks = Array.from(new Set(modules.flatMap(m => m.track || [])));
            setTracks(uniqueTracks);
        }
    }, [modules]);

    useEffect(() => {
        if (courseModulesData) {
            setCourseModules(courseModulesData);
        } else {
            setCourseModules([{ id: 0, name: "", numberOfDays: 0, days: [] }]);
        }
    }, [courseModulesData]);

    return {
        modules,
        tracks,
        filteredModules,
        setFilteredModules,
        courseModules,
        setCourseModules,
    };
}