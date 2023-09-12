import Logo from "@/src/components/dataDisplay/Logo";
import Footer from "@/src/components/layouts/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <Main>{children}</Main>
            </div>
            <Footer />
        </div>
    );
}

const Header = () => {
    return (
        <header
            className="
                p-4 bg-white
                min-w-full flex justify-center
                h-fit
            "
        >
            <Logo />
        </header>
    );
};

const Main = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex flex-col items-center justify-center w-full bg-white">
            <div className="container px-4 py-16 max-w-5xl w-full flex justify-center items-center">{children}</div>
        </main>
    );
};
