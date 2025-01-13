import Page from "@components/Page";
import ModuleDetails from "../sections/ModuleDetails";
import { useIdFromPath } from "@helpers/helperHooks";
import { useQueryCourseById, useQueryModulesByCourseId } from "@api/course/courseQueries";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";
import DeleteBtn from "@components/buttons/DeleteBtn";
import { Link } from "react-router-dom";
import { calculateCourseDayDates, getWeekNumberOfModule, numberOfDaysInCourse } from "../helpers/courseUtils";
import DeployModal from "../sections/DeployModal";

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

      {course && modules &&

        <section className="grid grid-rows-9 grid-cols-9 h-screen bg-white m-5 rounded-lg overflow-hidden drop-shadow-xl">
          {/* First Row, First Column */}
          <div className="row-span-1 col-span-2 bg-yellow-500 text-center flex items-center justify-center" style={ {backgroundColor: course.color} }>
            <h2 className="text-3xl">{course?.name || "Course Name"}</h2>
          </div>

          {/* First Row, Second Column */}
          <div className="row-span-1 col-span-7 text-center flex items-center justify-center border-b-2">
            <h2 className="text-3xl">Modules</h2>
          </div>

          <div className="row-span-8 col-span-2 border-r-2 p-10 flex flex-col h-full">
            <div className="flex place-content-around p-3 border-b-4 h-20">
              <div className="flex flex-col items-center">
                <h3>{modules.length}</h3>
                <p>Modules</p>
              </div>
              <div className="flex flex-col items-center">
                <h3>{numberOfDaysInCourse(course)}</h3>
                <p>Days</p>
              </div>
              <div className="flex flex-col items-center">
                <h3>{course.numberOfWeeks}</h3>
                <p>Weeks</p>
              </div>
            </div>

            <div className="p-7 text-center">
              <h3 className="text-xl">Module Timeline</h3>
            </div>

            <div className="relative flex-grow">
              <ul className="timeline timeline-vertical relative flex flex-col h-full">
                <li className="relative  flex flex-col items-center justify-center">
                  <div className="bg-accent w-3 h-3 border rounded-lg"></div>
                </li>
                {modules.map((moduleElement, index) => (
                  <li key={moduleElement.id} className="relative">
                    <hr />
                    <div
                      className={`${index % 2 === 0 ? "timeline-start" : "timeline-end"
                        } timeline-box`}
                    >
                      {moduleElement.name}
                    </div>
                    <div className="timeline-middle">
                      <p>[{getWeekNumberOfModule(course, moduleElement.id!)}]</p>
                    </div>
                    <hr />
                  </li>
                ))}

                <li className="relative flex-grow flex flex-col items-center justify-center">
                  <hr />
                  <div className="bg-accent w-3 h-3 border rounded-lg"></div>
                </li>
              </ul>
            </div>

            <div className="mt-5 flex flex-col gap-6 p-8">
              <button className="btn btn-primary" onClick={() => document.getElementById('my_DeployModal_1')!.showModal()}>Deploy Bootcamp</button>
              <DeployModal course={course} modules={modules} />
            </div>
          </div>




          {/* Second Row, Second Column */}
          <div className="row-span-8 col-span-7">
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
              <Link to={`/courses/edit/${courseId}`} className="btn btn-secondary" >Edit Course</Link>
              <DeleteBtn onClick={() => console.log("you clicked delete")}>Delete Course</DeleteBtn>

              <p> Track: {course?.name}</p>
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  backgroundColor: course.color,
                  borderRadius: "3px",
                }}
              > </div>

            </div>
          </div>
        </section>
      }

    </Page>
  );
}
