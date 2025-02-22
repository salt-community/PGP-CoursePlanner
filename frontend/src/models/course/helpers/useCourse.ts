import { useState, useEffect } from "react";
import { ModuleType } from "@api/Types";
import { useQueryModules } from "@api/module/moduleQueries";
import { useQueryModulesByCourseId } from "@api/course/courseQueries";
import { Track } from "../../../api/Types";

export function useCourse(courseId: number) {
    const [filteredModules, setFilteredModules] = useState<ModuleType[]>([]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [courseModules, setCourseModules] = useState<ModuleType[]>([]);
    const { data: modules } = useQueryModules();
    const { data: courseModulesData } = useQueryModulesByCourseId(courseId);

    useEffect(() => {
        if (modules) {
            setFilteredModules(modules);
            const uniqueTracks = Array.from(new Set(modules.flatMap(m => m.tracks || [])));
            setTracks(uniqueTracks);
        }
    }, [modules]);

    useEffect(() => {
        if (courseModulesData) {
            setCourseModules(courseModulesData);
        } else {
            setCourseModules([{
                id: 0, name: "", numberOfDays: 0, days: [],
                tracks: [],
                creationDate: new Date
            }]);
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