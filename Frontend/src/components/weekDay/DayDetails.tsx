type Props = {
    button: React.ReactNode;
    content: React.ReactNode;
}

export default function DayDetails({button, content}: Props) {

    return (
        <section className="flex justify-center bg-background">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <div className="card-actions justify-end">
                        {button}
                    </div>
                   {content}
                </div>
            </div>
        </section>

    )

}