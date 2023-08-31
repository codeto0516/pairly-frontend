import Footer from "@/src/components/layouts/Footer";
import { Header } from "@/src/components/layouts/Header/Header";
import Main from "@/src/components/layouts/Main";


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <Main>{children}</Main>
            <Footer />
        </>
    );
}
