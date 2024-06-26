import { postCourse } from "../../api/CourseApi";
import Page from "../../components/Page";
import Course from "../../components/course/Course";
import { CourseType, CourseModule } from "../../components/course/Types";
import { ModuleType } from "../../components/module/Types";

export default function CreateCourse() {

    const emptyModule: ModuleType = {
        name: "",
        numberOfDays: 0,
        days: [],
        courseModules: []
    }
    
    const emptyCourse: CourseType =
    {
        name: "",
        numberOfWeeks: 1,
        modules: [],
        moduleIds: [0]
    }

    const emptyCourseModule: CourseModule = {
        course: emptyCourse,
        module: emptyModule
    }

    emptyCourse.modules = [emptyCourseModule];

    return (
        <Page>
            <Course course={emptyCourse} submitFunction={postCourse} buttonText="Create" />
        </Page>
    )
}