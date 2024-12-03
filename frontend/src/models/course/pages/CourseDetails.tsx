import { Link, useNavigate } from "react-router-dom";
import { deleteCourse, getCourseById } from "@api/CourseApi";
import Page from "@components/Page";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIdFromPath } from "@helpers/helperHooks";
import { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { editAppliedCourse, getAllAppliedCourses, postAppliedCourse, } from "@api/AppliedCourseApi";
import { convertToGoogle } from "@helpers/googleHelpers";
import DeleteBtn from "@components/buttons/DeleteBtn";
import { deleteCourseFromGoogle } from "@api/GoogleCalendarApi";
import "reactjs-popup/dist/index.css";
import { CourseType } from "../Types";
import LoadingMessage from "@components/LoadingMessage";
import ErrorMessage from "@components/ErrorMessage";
import ColorPickerModal from "@components/ColorPickerModal";
import { getModulesByCourseId } from "@api/CourseModulesApi";
import { ModuleType } from "@models/module/Types";

export default function CourseDetails() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isInvalidDate, setIsInvalidDate] = useState<boolean>(false);
  const [groupEmail, setGroupEmail] = useState<string>("");

  const navigate = useNavigate();

  const courseId = useIdFromPath();
  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["courses", courseId],
    queryFn: () => {
      return getCourseById(courseId);
    },
  });

  const {
    data: modules,
    isLoading: isLoadingModules,
    isError: isErrorModules,
  } = useQuery<ModuleType[]>({
    queryKey: ["appliedModules", courseId],
    queryFn: () => getModulesByCourseId(courseId),
  });

  const {
    data: allAppliedCourses,
    isLoading: isLoadingAppliedCourses,
    isError: isErrorAppliedCourses,
  } = useQuery<CourseType[]>({
    queryKey: ["appliedCourses"],
    queryFn: () => getAllAppliedCourses(),
  });

  let defaultColor = "#FFFFFF";
  const [color, setColor] = useState(defaultColor);
  const [isColorNotSelected, setIsColorNotSelected] = useState<boolean>(false);
  useEffect(() => {
    if (course && allAppliedCourses) {
      const appliedCoursesWithCourseId = allAppliedCourses.filter(
        (m) => m.id! === course.id
      );

      if (appliedCoursesWithCourseId.length > 0) {
        defaultColor = appliedCoursesWithCourseId[0].color!;
        setColor(defaultColor);
      }
    }
  }, [course, allAppliedCourses]);

  const handleGoogleGroupAdd = async () => {
    if (course && modules) {
      convertToGoogle(modules, startDate, course.name, groupEmail);
    }
  };

  const mutationPostAppliedCourse = useMutation({
    mutationFn: (appliedCourse: CourseType) => { return postAppliedCourse(appliedCourse) },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appliedCourses'] });
      navigate("/activecourses");
    },
  });

  const mutationEditAppliedCourse = useMutation({
    mutationFn: (appliedCourse: CourseType) => { return editAppliedCourse(appliedCourse) },
  });

  const handleApplyTemplate = async () => {
    setIsColorNotSelected(false);
    setIsInvalidDate(false);
    if (
      color == "#FFFFFF" ||
      startDate.getDay() == 6 ||
      startDate.getDay() == 0
    ) {
      if (color == "#FFFFFF") setIsColorNotSelected(true);
      if (startDate.getDay() == 6 || startDate.getDay() == 0)
        setIsInvalidDate(true);
    } else {
      const appliedCoursesWithCourseId = allAppliedCourses!.filter(
        (m) => m.id! == course!.id
      );
      if (appliedCoursesWithCourseId.length > 0 && color != defaultColor) {
        await Promise.all(
          appliedCoursesWithCourseId!.map(async (appliedCourse) => {
            const newAppliedCourse: CourseType = {
              id: appliedCourse.id,
              name: appliedCourse.name,
              startDate: appliedCourse.startDate,
              endDate: appliedCourse.endDate,
              moduleIds: appliedCourse.moduleIds,
              color: color,
              isApplied: appliedCourse.isApplied
            };
            mutationEditAppliedCourse.mutate(newAppliedCourse);
          })
        );
      }

      const appliedCourse: CourseType = {
        name: course?.name ?? "",
        startDate: startDate,
        color: color,
        moduleIds: modules?.map(m => m.id!),
        isApplied: true
      };
      mutationPostAppliedCourse.mutate(appliedCourse);
      navigate("/activecourses");
    }
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: number) => {
      return deleteCourse(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses", courseId],
      });
      navigate(`/courses`);
    },
  });

  return (
    <Page>
      {(isLoading || isLoadingModules || isLoadingAppliedCourses) && (
        <LoadingMessage />
      )}
      {(isError || isErrorModules || isErrorAppliedCourses) && <ErrorMessage />}
      {course && allAppliedCourses && (
        <section className="mx-auto flex flex-col gap-4 px-4 md:px-24 lg:px-56">
          <section className="flex items-center flex-col gap-4 px-1 sm:p-0">
            <h1 className="pb-4 text-xl text-primary font-bold">
              {course.name}
            </h1>
            {modules &&
              modules.map((module, index) => (
                <div key={module.id}>
                  <h1 className="text-lg font-bold self-start">
                    <Link
                      to={`/modules/details/${module.id}`}
                      className="hover:italic">
                      Module {index + 1}: {module.name}
                    </Link>
                  </h1>
                  <table
                    className="table table-fixed table-sm lg:table-lg"
                    key={"module_" + index}>
                    <thead>
                      <tr>
                        <th className="text-sm w-1/6">Day</th>
                        <th className="text-sm w-1/6">Events</th>
                        <th className="text-sm w-2/3">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {module.days.map((day, dayIndex) => (
                        <tr key={dayIndex}>
                          <td className="text-sm">{day.dayNumber}</td>
                          <td className="text-sm">{day.events.length}</td>
                          <td className="text-sm">{day.description}</td>
                        </tr>
                      ))}
                      <tr></tr>
                    </tbody>
                  </table>
                </div>
              ))}
          </section>

          <div className="pt-4 flex gap-4 flex-col sm:flex-row">
            <Link
              to={`/courses/edit/${courseId}`}
              className="btn btn-sm py-1 max-w-xs btn-info text-white">
              Edit Course
            </Link>
            <DeleteBtn onClick={() => mutation.mutate(courseId)}>
              Delete Course
            </DeleteBtn>
          </div>
          <p
            className="error-message text-red-600 text-sm hidden"
            id="invalid-module-delete">
            Cannot delete this course, it is used in the calendar!
          </p>
          <div className="flex gap-4 mt-10">
            <div className="self-start mt-2">
              <h1 className="font-bold text-black] text-sm">
                Enter start date:{" "}
              </h1>
            </div>
            <DatePicker
              name="startDate"
              value={startDate}
              onChange={(date) => setStartDate(date!)}
              sx={{
                height: "35px",
                padding: "0px",
                "& .css-nxo287-MuiInputBase-input-MuiOutlinedInput-input": {
                  fontFamily: "Montserrat",
                  color: "var(--fallback-bc,oklch(var(--bc)/0.7))",
                  padding: "6px",
                },
                "& .css-1yq5fb3-MuiButtonBase-root-MuiIconButton-root": {
                  color: "var(--fallback-bc,oklch(var(--bc)/0.7))",
                },
                "& .css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root": {
                  borderRadius: "var(--rounded-btn, 0.5rem)"
                }
              }}
              className="input input-bordered"
            />
            <ColorPickerModal
              color={color}
              setColor={setColor}
            />
            <input
              placeholder="Enter group email"
              onChange={(e) => setGroupEmail(e.target.value)}
              className="self-start mt-2"></input>
          </div>
          {isColorNotSelected && (
            <p
              className="error-message text-red-600 text-sm"
              id="invalid-helper">
              Please select a color for the calendar items
            </p>
          )}
          {isInvalidDate && (
            <p
              className="error-message text-red-600 text-sm"
              id="invalid-helper">
              Please select a weekday for the start date
            </p>
          )}
          <div className="pt-4 mb-4 flex gap-4 flex-col sm:flex-row">
            <button
              onClick={handleApplyTemplate}
              className="btn btn-sm py-1 max-w-fit btn-primary text-white">
              Add to app calendar
            </button>
            <button
              onClick={() => handleGoogleGroupAdd()}
              className="btn btn-sm py-1 max-w-xs btn-success text-white">
              Add to Google calendar{" "}
            </button>
            <DeleteBtn onClick={() => deleteCourseFromGoogle(course.name)}>
              Remove from Google calendar
            </DeleteBtn>
          </div>
        </section>
      )}
    </Page>
  );
}
