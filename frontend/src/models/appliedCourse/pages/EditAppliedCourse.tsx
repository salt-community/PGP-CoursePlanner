import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useQueryAppliedCourseById } from "@api/appliedCourse/appliedCourseQueries";
import { EditBootcamp } from "@models/course/sections/EditBootcamp";

export default function EditAppliedCourse() {
    const appliedCourseId = useIdFromPath();
    const { data: appliedCourse, isLoading, isError } = useQueryAppliedCourseById(appliedCourseId);

    if (isLoading) {
        return <p>Loading course data...</p>;
    }
    if (isError || !appliedCourse) {
        return <p>There was an error loading the course data.</p>;
    }

    return (
        <Page>
            { appliedCourse.modules.length > 0 &&
                <EditBootcamp course={appliedCourse} />
            }
           
        </Page>
    );
}
