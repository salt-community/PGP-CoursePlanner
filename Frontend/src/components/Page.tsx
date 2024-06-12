import NavBar from "./NavBar";

type Props = {
    pageContent: React.ReactNode;
}

export default function Page({ pageContent }: Props) {

    return (
        <section className="w-screen h-screen">
            <NavBar />
            {pageContent}
        </section>
    )
}