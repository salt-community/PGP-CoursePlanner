import Page from "@components/Page";
import ModuleDetails from "../sections/ModuleDetails";
import { useState } from "react";
import { useIdFromPath } from "@helpers/helperHooks";
import { useQueryCourseById, useQueryModulesByCourseId } from "@api/course/courseQueries";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";

export default function CourseDetails() {
  const courseId = useIdFromPath();

  const [moduleId, setModuleId] = useState<number>(-1);
  const { data: course, isLoading: isLoadingCourse, isError: isErrorCourse } = useQueryCourseById(courseId);

  const { data: modules, isLoading: isLoadingCourseModules, isError: isErrorCourseModules } = useQueryModulesByCourseId(courseId);


  
  if (isLoadingCourse || isLoadingCourseModules) {
    return (
      <>
        <LoadingMessage />
      </>
    )
  }

  if (isErrorCourse || isErrorCourseModules) {
    return (
      <ErrorMessage />

    )
  }

  return (
    <>

      <Page>

        <h1 className="text-4xl pl-5">Course</h1>

        <section className="grid grid-rows-6 grid-cols-4 h-screen bg-white m-5 rounded-lg overflow-hidden drop-shadow-xl">
          {/* First Row, First Column */}
          <div className="row-span-1 col-span-1 bg-yellow-500 text-center flex items-center justify-center">
            <h2 className="text-3xl">{course.name}</h2>
          </div>

          {/* First Row, Second Column */}
          <div className="row-span-1 col-span-3 text-center flex items-center justify-center border-b-2">
            <h2 className="text-3xl">Modules</h2>
          </div>

          {/* Second Row, First Column */}
          <div className="row-span-5 col-span-1 border-r-2 p-10">

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
          <div className="row-span-5 col-span-3">
            <button onClick={() => setModuleId(modules[0].id!)}> click me to set a moduleId</button>
            {moduleId != -1 && <ModuleDetails module={modules.find(m => m.id == moduleId)!} />}

          </div>
        </section>

      </Page>
    </>
  )
}