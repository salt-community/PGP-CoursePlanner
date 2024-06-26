import NavBar from "./NavBar";

type Props = {
    children: React.ReactNode;
}

export default function Page({ children }: Props) {

    return (
        <section className="w-screen h-screen flex flex-col items-center">
            <NavBar />
            {children}
        </section>
    )
}