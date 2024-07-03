type Props = {
    button: React.ReactNode;
    content: React.ReactNode;
}

export default function ModalCard({ button, content }: Props) {

    return (
        <section className="flex justify-center bg-background">
            <div className="w-1/2 bg-base-100 shadow-xl p-5">
                    <div className="flex justify-end">
                        {button}
                    </div>
                    <div>
                        {content}
                    </div>
            </div>
        </section>

    )

}