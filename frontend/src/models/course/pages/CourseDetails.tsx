import Page from "@components/Page";
import ModuleDetails from "../sections/ModuleDetails";
import { useIdFromPath } from "@helpers/helperHooks";
import { useQueryCourseById, useQueryModulesByCourseId } from "@api/course/courseQueries";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";

export default function CourseDetails() {
  const courseId = useIdFromPath();

  const { data: course, isLoading: isLoadingCourse, isError: isErrorCourse } = useQueryCourseById(courseId);
  const { data: modules, isLoading: isLoadingCourseModules, isError: isErrorCourseModules } = useQueryModulesByCourseId(courseId);

  // Loading or error state handling
  if (isLoadingCourse || isLoadingCourseModules) {
    return <LoadingMessage />;
  }

  if (isErrorCourse || isErrorCourseModules) {
    return <ErrorMessage />;
  }

  return (
    <Page>
      <h1 className="text-4xl pl-5">Course</h1>

      <section className="grid grid-rows-9 grid-cols-4 h-screen bg-white m-5 rounded-lg overflow-hidden drop-shadow-xl">
        {/* First Row, First Column */}
        <div className="row-span-1 col-span-1 bg-yellow-500 text-center flex items-center justify-center">
          <h2 className="text-3xl">{course?.name || "Course Name"}</h2>
        </div>

        {/* First Row, Second Column */}
        <div className="row-span-1 col-span-3 text-center flex items-center justify-center border-b-2">
          <h2 className="text-3xl">Modules</h2>
        </div>

        {/* Second Row, First Column */}
        <div className="row-span-8 col-span-1 border-r-2 p-10">
          <div className="flex place-content-around p-3 border-b-4  h-20">
            <div className="flex flex-col items-center"><h3>3</h3> <p>Modules</p></div>
            <div className="flex flex-col items-center"><h3>10</h3> <p>Days</p></div>
            <div className="flex flex-col items-center"><h3>2</h3> <p>Weeks</p></div>
          </div>

          <div className="p-7 text-center">
            <h3 className="text-xl">Module Timeline</h3>
          </div>
        </div>

        {/* Second Row, Second Column */}
        <div className="row-span-8 col-span-3">
          <div className="h-5/6 overflow-scroll">
            {modules && (
              <>
                {modules.map((modulemap, index) =>
                  <ModuleDetails module={modulemap} key={index} />
                )}
              </>
            )}
          </div>
          <div className="flex pl-14 pt-4 gap-6">
            <button className="btn btn-secondary" >Edit Course</button>
            <button className="btn bg-red-500 text-accent">Delete Course</button>

            <p> Track: {course?.name}</p>
            <div
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: course?.color,
                borderRadius: "3px",
              }}
            > </div>

          </div>
        </div>
      </section>
    </Page>
  );
}
