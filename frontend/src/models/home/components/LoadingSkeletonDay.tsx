export default function LoadingSkeletonDay() {
    return (
        <div className="flex flex-col gap-12 p-4">
            <div className="skeleton h-4 w-full mt-12"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
        </div>
    )
}