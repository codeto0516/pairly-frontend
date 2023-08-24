"use client";

import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import Loading from "../app/loading";

const SessionContext = createContext<any>({});

export const CustomSessionProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(session ? session.user : null);
    // console.log(session, user);
    
    useEffect(() => {
        if (session) {
            setUser(session.user);
            // console.log(session);
            
        }
    }, [session]);

    if (status === "loading" || user === null) {
        return <Loading/>
    }

    return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>;
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
