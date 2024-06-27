import NavBar from "./NavBar";

type Props = {
    children: React.ReactNode;
}

export default function Page({ children }: Props) {

    return (
        <section className="w-screen h-screen">
            <NavBar />
            {/* <section className="p-20 flex flex-col items-center"> */}
                {children}
            {/* </section> */}
        </section>
    )
}