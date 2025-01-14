import { CourseType } from "@models/course/Types";

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
            <p>track: {course.track.name}</p>
            <label className="text-lg font-medium">Track:</label>
            <select
                value={course.track.name}
                onChange={(e) => setCourse({ ...course, track:{ ...course.track, name: e.target.value } })}
                className="w-full p-2 border border-gray-300 rounded-md"
            >
                <option value="" disabled>Select a track</option>
                <option value="Track 1">Track 1</option>
                <option value="Track 2">Track 2</option>
                <option value="Track 3">Track 3</option>
            </select>
        </div>
    </div>

    );
};

export default CourseInfo;
