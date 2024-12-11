import NavBar from "./NavBar";

type Props = {
    children: React.ReactNode;
}

export default function Layout({ children } : Props) {
    return (
      <div className="flex">
        <NavBar />
        <div className="ml-64 flex-1 p-5">
          {children}
        </div>
      </div>
    );
  }