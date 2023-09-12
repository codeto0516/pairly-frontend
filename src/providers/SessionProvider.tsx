"use client";

import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import Loading from "../app/loading";
import { usePathname } from "next/navigation";
import { auth } from "../app/(auth)/api/auth/[...nextauth]/config";

// ローディングを表示しないページ
const excludedPaths = ["/signin", "/signup", "/api/auth/error"];

export const SessionContext = createContext<any>({});
export const useUserData = () => useContext(SessionContext);

const CustomSessionProvider = ({ children }: { children: React.ReactNode }) => {
    const pathName = usePathname();
    const { status } = useSession();
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        auth.onAuthStateChanged((user) => setCurrentUser(() => user));
    }, []);

    // if (pathName === "/signin" || pathName === "/signup" || pathName === "/api/auth/error") {
    //     return children; // ローディングを表示しない
    // }
    if (excludedPaths.includes(pathName)) {
        return children; // ローディングを表示しない
    }

    if (status === "loading" || currentUser === null) {
        return <Loading />;
    }

    return <SessionContext.Provider value={{ currentUser, setCurrentUser }}>{children}</SessionContext.Provider>;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <NextAuthSessionProvider>
            <CustomSessionProvider>{children}</CustomSessionProvider>
        </NextAuthSessionProvider>
    );
};