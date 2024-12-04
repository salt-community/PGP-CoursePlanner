import { CourseType } from "@models/course/Types";
import { deleteAppliedCourse, postAppliedCourse, updateAppliedCourse } from "./appliedCourseFetches";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function useMutationPostAppliedCourse() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (appliedCourse: CourseType) => {
            return postAppliedCourse(appliedCourse)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appliedCourses'] });
            navigate("/activecourses");
        },
    });

    return mutation
}

export function useMutationUpdateAppliedCourse() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (appliedCourse: CourseType) => {
            return updateAppliedCourse(appliedCourse);
        },
        onSuccess: (_data, appliedCourse) => {
            queryClient.invalidateQueries({ queryKey: ["appliedCourses", appliedCourse.id] });
            navigate(-1);
        },
    });

    return mutation
}

export function useMutationDeleteAppliedCourse() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number) => {
            return deleteAppliedCourse(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appliedCourses'] })
            navigate(`/activecourses`);
        }
    })

    return mutation
}