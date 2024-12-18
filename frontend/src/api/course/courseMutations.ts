import { CourseType } from "@models/course/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteCourse, postCourse, updateCourse } from "./courseFetches";

export function useMutationPostCourse() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (course: CourseType) => {
            return postCourse(course);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            navigate(`/courses`)
        }
    })

    return mutation;
}

export function useMutationUpdateCourse() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (course: CourseType) => {
            return updateCourse(course);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['courses'] })
            navigate(`/courses`)
        }
    })

    return mutation;
}

export function useMutationDeleteCourse() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number) => {
            return deleteCourse(id);
        },
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({
                queryKey: ["courses", id],
            });
            navigate(`/courses`);
        },
    });

    return mutation;
}