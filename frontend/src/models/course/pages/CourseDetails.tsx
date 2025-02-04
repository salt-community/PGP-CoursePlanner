import Page from "@components/Page";
import ModuleDetails from "../sections/ModuleDetails";
import { useIdFromPath } from "@helpers/helperHooks";
import { useQueryCourseById } from "@api/course/courseQueries";
import DeleteBtn from "@components/buttons/DeleteBtn";
import { Link } from "react-router-dom";
import { getWeekNumberOfModule, numberOfDaysInCourse } from "../helpers/courseUtils";
import DeployModal from "../sections/DeployModal";
import ErrorModal from "@components/ErrorModal";
import Header from "@components/Header";

export default function CourseDetails() {
  const courseId = useIdFromPath();

  const { data: course, isError: isErrorCourse } = useQueryCourseById(courseId);

  console.log(course?.modules);

  return (
    <Page>
      <Header>
        <h1 className="text-3xl font-semibold">
          Course Template
        </h1>
      </Header>
      {course &&
        <section className="grid grid-rows-[145px_1fr] grid-cols-9 bg-white m-5 mt-0 rounded-lg overflow-hidden drop-shadow-xl">
          {/* First Row, First Column */}
          <div className="row-span-1 col-span-2 bg-yellow-500 text-center flex items-center justify-center" style={{ backgroundColor: course.color }}>
            <h2 className="text-4xl">{course.name || "Course Name"}</h2>
          </div>

          {/* First Row, Second Column */}
          <div className="row-span-1 col-span-7 text-center flex items-center justify-center border-b-2">
            <h2 className="text-4xl">Modules</h2>
          </div>

          {/* Second Row, First Column */}
          <div className="row-span-8 col-span-2 border-r-2 p-10 flex flex-col h-full">
            <div className="flex place-content-around p-3 border-b-4 h-20">
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold">{course.modules.length}</h3>
                <p>Modules</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold">{numberOfDaysInCourse(course)}</h3>
                <p>Days</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-bold">{course.numberOfWeeks}</h3>
                <p>Weeks</p>
              </div>
            </div>

            <div className="p-7 pb-2 text-center">
              <h3 className="text-2xl">
                Module Timeline
              </h3>
            </div>

            <div className="relative flex-grow">
              <ul className="timeline timeline-vertical flex flex-col h-full">
                <li className="flex justify-center">
                  <p className="py-2 text-sm">
                    Week
                  </p>
                </li>
                <li className="flex flex-col items-center justify-center">
                  <div className="bg-accent w-3 h-3 border rounded-lg"></div>
                </li>
                {course.modules.map((moduleElement, index) => (
                  <li key={moduleElement.module.id} className="relative">
                    <hr />
                    <div
                      className={`${index % 2 === 0 ? "timeline-start" : "timeline-end"
                        } timeline-box flex flex-col items-center py-1 px-4 min-w-32`}
                    >
                      <p className="font-semibold">
                        {moduleElement.module.name}
                      </p>
                      <p className="text-sm">
                        Days: <span className="font-bold">
                          {moduleElement.module.days.length}
                        </span>
                      </p>
                    </div>
                    <div className="timeline-middle">
                      <p className="border rounded px-2">{getWeekNumberOfModule(course, moduleElement.module.id!)}</p>
                    </div>
                    <hr />
                  </li>
                ))}
                <li className="flex-grow flex flex-col items-center justify-center">
                  <hr />
                  <div className="bg-accent w-3 h-3 border rounded-lg"></div>
                </li>
              </ul>
            </div>

            <div className="mt-5 flex flex-col gap-6 p-8">
              <button className="btn btn-primary" onClick={() => (document.getElementById('my_DeployModal_1') as HTMLDialogElement).showModal()}>Deploy Bootcamp</button>
              <DeployModal course={course} />
            </div>
          </div>

          {/* Second Row, Second Column */}
          <div className="row-span-8 col-span-7">
            <div className="h-5/6 overflow-scroll">
              {course.modules.map((modulemap, index) =>
                <ModuleDetails module={modulemap} key={index} />
              )}
            </div>
            <div className="flex pl-14 pt-4 gap-6">
              <Link to={`/courses/edit/${courseId}`} className="btn btn-secondary" >Edit Course</Link>
              <DeleteBtn onClick={() => console.log("you clicked delete")}>Delete Course</DeleteBtn>

              <p> Track: {course?.track.name
              }</p>
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
      {isErrorCourse && <ErrorModal error="Days" />}
    </Page>
  );
}
