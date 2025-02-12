import { CourseType } from "@api/Types";

interface CourseInfoProps {
        course: CourseType;
        setCourse: React.Dispatch<React.SetStateAction<CourseType>>;
    }

const CourseInfo = ({ course, setCourse }: CourseInfoProps) => {
    return (
            <div className="flex flex-row gap-2 flex-1">
        <div className="flex flex-col gap-2 flex-1">
            <label className="text-lg font-medium">Course name:</label>
            <input
                type="text"
                value={course.name}
                onChange={(e) => setCourse({ ...course, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
            />
        </div>
        <div className="flex flex-col gap-2 ml-auto">
            <label className="text-lg font-medium">Track:</label>
        </div>
    </div>

    );
};

export default CourseInfo;
