"use client";

import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import Loading from "../app/loading";
import { usePathname } from "next/navigation";

const SessionContext = createContext<any>({});

export const CustomSessionProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(session ? session.user : null);
    const [partner, setPartner] = useState(session ? session.partner : null);
    const pathName = usePathname();
    
    useEffect(() => {
        if (session) {
            setUser(session.user);
            setPartner(session.partner);
        }
    }, [session]);

    if (pathName === "/signin" || pathName === "/signup") {
        return children; // ローディングを表示しない
    }

    if (status === "loading" || user === null) {
        return <Loading />;
    }

    // console.log(user, partner);

    return <SessionContext.Provider value={{user, partner}}>{children}</SessionContext.Provider>;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <NextAuthSessionProvider>
            <CustomSessionProvider>{children}</CustomSessionProvider>
        </NextAuthSessionProvider>
    );
};

export const useUserData = () => {
    return useContext(SessionContext);
};
