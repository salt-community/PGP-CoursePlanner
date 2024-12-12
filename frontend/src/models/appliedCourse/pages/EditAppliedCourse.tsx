import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useEffect, useState } from "react";
import { useQueryAppliedCourseById } from "@api/appliedCourse/appliedCourseQueries";
import { useMutationUpdateAppliedCourse } from "@api/appliedCourse/appliedCourseMutations";

export default function EditAppliedCourse() {
    const appliedCourseId = useIdFromPath();
    const { data: appliedCourse, isLoading, isError } = useQueryAppliedCourseById(appliedCourseId);
    const mutationUpdateAppliedCourse = useMutationUpdateAppliedCourse();

    const [courseName, setCourseName] = useState<string>("");

    useEffect(() => {
        if (appliedCourse) {
            setCourseName(appliedCourse.name);
        }
        console.log("appliedCourse");
        console.log(appliedCourse);
    }, [appliedCourse]);

    const handleUpdateCourse = () => {
        if (appliedCourse) {
            mutationUpdateAppliedCourse.mutate({
                ...appliedCourse,
                name: courseName, 
            });
        }
    };

    const addAO = () => {
        setCourseName((prevName) => prevName + "O");
    };

    const Save = () => {
        handleUpdateCourse();
    };

    if (isLoading) {
        return <p>Loading course data...</p>;
    }

    if (isError || !appliedCourse) {
        return <p>There was an error loading the course data.</p>;
    }

    return (
        <Page>
            <div>
                <button onClick={addAO}>Click to add "O"</button>
            </div>
            <button onClick={Save}>Save</button>
            <section className="px-4 md:px-24 lg:px-56">
                <h1 className="text-xl font-semibold mb-6">Edit Applied Course</h1>
                <p>Current name: {courseName}</p>
                <p>Is Applied: {appliedCourse.isApplied ? "Yes" : "No"}</p>
                <p>---------------</p>
                
                <div>
                    {appliedCourse.modules.map((module) => (
                        <div key={module.moduleId}>
                            <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
                            <h3>{module.module?.name}</h3>
                            <p>id: {module.module?.id}</p>
                            <p>Order: {module.module?.order}</p>
                            </div>
                            <div style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
                            <p>
                                <strong>Days:</strong>
                            </p>
                            {module.module?.days.map((day) => (
                                <div key={day.id} style={{ border: "1px solid black", padding: "10px", margin: "10px 0" }}>
                                    <p>Day Number: {day.dayNumber}</p>
                                    <p>Description: {day.description}</p>
                                    <p>Is Applied: {day.isApplied ? "Yes" : "No"}</p>

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
                            ))}
                            </div>

                            
                        </div>
                    ))}
                </div>
                
            </section>
        </Page>
    );
}
