import { useMutation, useQuery, useQueryClient } from "react-query";
import Page from "../../../components/Page";
import { deleteAppliedCourse, getAllAppliedCourses } from "../../../api/AppliedCourseApi";
import DeleteBtn from "../../../components/buttons/DeleteBtn";
import { Link, useNavigate } from "react-router-dom";
import LoadingMessage from "../../../components/LoadingMessage";
import ErrorMessage from "../../../components/ErrorMessage";
import { getCookie } from "../../../helpers/cookieHelpers";
import NavigateToLogin from "../../login/NavigateToLogin";

export default function AppliedCourses() {
    const navigate = useNavigate();

    const { data: allAppliedCourses, isLoading, isError } = useQuery({
        queryKey: ['allAppliedCourses'],
        queryFn: getAllAppliedCourses
    });
    console.log(allAppliedCourses);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (id: number) => {
            return deleteAppliedCourse(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allAppliedCourses'] })
            navigate(`/activecourses`);
        }
    })

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        getCookie("access_token") == undefined ?
            <NavigateToLogin />
            :
            <Page>
                <section className="px-4 md:px-24 lg:px-56">
                    {isLoading && <LoadingMessage />}
                    {isError && <ErrorMessage />}
                    {allAppliedCourses && allAppliedCourses?.length > 0
                        ? <>
                            <h1 className="flex justify-center text-xl mb-6">The following courses are currently in the calendar</h1>
                            {allAppliedCourses && allAppliedCourses.map((appliedCourse) =>
                                <>
                                    <div key={appliedCourse.id}  className="flex flex-row justify-center">
                                        <div className="w-1/2">
                                            <h1 className="text-xl font-bold mb-2">{appliedCourse.name}</h1>
                                            <h2 className="text-lg mb-2 mt-4">Start date: {new Date(appliedCourse.startDate).getDate()} {monthNames[new Date(appliedCourse.startDate).getMonth()]}, {new Date(appliedCourse.startDate).getFullYear()}</h2>
                                            <h2 className=" text-lg flex items-center">Calendar color:
                                                <div style={{ backgroundColor: appliedCourse.color }} className="w-5 h-5 ml-2"></div>
                                            </h2>
                                        </div>
                                        <div className="w-1/2 flex flex-row gap-2 items-end">
                                            <DeleteBtn onClick={() => mutation.mutate(parseInt(appliedCourse.id!.toString()))}>Delete</DeleteBtn>
                                            <Link to={`/activecourses/edit/${appliedCourse.id}`} className="btn btn-sm py-1 max-w-xs btn-info text-white">Edit</Link>
                                        </div>
                                    </div>
                                    <div className="mt-6 mb-4 border-b-2 border-gray-100"></div>
                                </>
                            )}
                        </>
                        : <div className="text-xl">There are currently no active courses in the calendar</div>}
                </section>
            </Page>
    )
}