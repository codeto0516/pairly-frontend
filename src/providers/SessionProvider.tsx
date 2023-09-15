"use client";

import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import Loading from "../app/loading";
import { usePathname } from "next/navigation";
import { User } from "../types/user";
import { auth } from "../app/(auth)/api/auth/[...nextauth]/config";
import { useAuth } from "../hooks/useAuth";

// ローディングを表示しないページ
const excludedPaths = ["/signin", "/signup", "/api/auth/error"];

type SessionContextType = {
    currentUser: User | null; // ユーザー情報の型に合わせて定義
    updateCurrentUser: (user: User) => void; // ユーザー情報をセットする関数の型に合わせて定義
};
const SessionContext = createContext<SessionContextType>({
    currentUser: null,
    updateCurrentUser: () => {},
});
export const useUserData = () => useContext<SessionContextType>(SessionContext);

const CustomSessionProvider = ({ children }: { children: React.ReactNode }) => {
    const pathName = usePathname();
    const { data: session, status } = useSession();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const updateCurrentUser = (user: User) => setCurrentUser(() => user);
    const { signOut } = useAuth();

    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        try {
            
            if (!session?.token) return;
            (async () => {
                auth.onAuthStateChanged((user) => {
                    console.log(user);
                });
                const res = await fetch("http://localhost/api/v1/users/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.token}`,
                    },
                });

                if (!res.ok) throw new Error(res.statusText);

                const decoded = await res.json();
                console.log(decoded);

                decoded?.data?.user && setCurrentUser(() => decoded?.data.user);
            })();
        } catch (error) {
            (async () => {
                await signOut();
            })();
            console.log(error);
        }
    }, [session?.token]);

    if (excludedPaths.includes(pathName)) {
        return children; // ローディングを表示しない
    }

    if (status === "loading" || session?.user === undefined || currentUser === null) {
        return <Loading />;
    }

    return <SessionContext.Provider value={{ currentUser, updateCurrentUser }}>{children}</SessionContext.Provider>;
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <NextAuthSessionProvider>
            <CustomSessionProvider>{children}</CustomSessionProvider>
        </NextAuthSessionProvider>
    );
};
