type Props = {
    statusCode: string
}

export default function SubmitErrorMessage({ statusCode }: Props) {
    return (
        <p className="label-text text-lg text-red-500 text-center w-fit">
            {
                statusCode === "401" ? "You are not authorized to access this resource." :
                statusCode === "404" ? "The requested resource was not found." :
                statusCode === "500" ? "An internal server error occurred. Please try again." :
                statusCode === "503" ? "The server is currently unavailable. Please try again later." :
                "An error occurred while processing your request. Please try again."
            }
        </p>
    )
}