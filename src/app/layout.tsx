import "@/src/app/globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Main from "@/src/components/layouts/Main";
import { Header } from "@/src/components/layouts/Header/Header";
import Footer from "@/src/components/layouts/Footer";
import { Suspense, useState } from "react";
import Loading from "./loading";
import { FramerMotionProvider } from "../providers/FramerMotionProvider";
import { SessionProvider } from "../providers/SessionProvider";
import { RecoilProvider } from "../providers/RecoilProvider";

const roboto = Roboto({
    weight: "400",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Pairly",
    description: "同棲するカップル用の家計簿アプリです",
    viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja" className="overflow-x-hidden">
            <body className={`${roboto.className} text-gray-800 overflow-x-hidden`}>
                <RecoilProvider>
                    <Suspense fallback={<Loading />}>
                        <SessionProvider>
                            <FramerMotionProvider>
                                <Header />
                                <Main>{children}</Main>
                                <Footer />
                            </FramerMotionProvider>
                        </SessionProvider>
                    </Suspense>
                </RecoilProvider>
            </body>
        </html>
    );
}
