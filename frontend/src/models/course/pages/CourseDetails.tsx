import Page from "@components/Page";
import { useIdFromPath } from "@helpers/helperHooks";
import { useQueryCourseById } from "@api/course/courseQueries";
import ErrorModal from "@components/ErrorModal";
import Header from "@components/Header";
import { useMutationDeleteCourse } from "@api/course/courseMutations";
import DeleteWarningModal from "@components/DeleteWarningModal";
import { useState } from "react";
import CourseSection from "../sections/CourseSection";

export default function CourseDetails() {
  const courseId = useIdFromPath();
  const [openModal, setOpenModal] = useState(false);
  const { data: course, isLoading: isLoadingCourse, isError: isErrorCourse } = useQueryCourseById(courseId);
  const mutationDeleteCourse = useMutationDeleteCourse();

  function handleDeleteCourse() {
    mutationDeleteCourse.mutate(courseId);
    if (mutationDeleteCourse.isSuccess) {
      setOpenModal(false);
    }
  }

  return (
    <Page>
      <Header>
        <h1 className="text-3xl font-semibold">
          Course Template
        </h1>
      </Header>
      <CourseSection setOpenModal={setOpenModal} course={course} isLoading={isLoadingCourse} />
      {course &&
        <DeleteWarningModal openModal={openModal} setOpenModal={setOpenModal} warning={`${course.name} Course Template`} handleDelete={handleDeleteCourse} isError={mutationDeleteCourse.isError} errorMessage={mutationDeleteCourse.error?.message} resetMutation={mutationDeleteCourse.reset} />
      }
      {isErrorCourse &&
        <ErrorModal error="Course Template" />
      }
    </Page >
  );
}
