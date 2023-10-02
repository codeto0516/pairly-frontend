"use client";

import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import Loading from "../app/loading";
import { usePathname } from "next/navigation";
import { User } from "../types/user";
import { auth } from "../app/(auth)/api/auth/[...nextauth]/config";
import { useAuth } from "../hooks/useAuth";
import urlJoin from "url-join";
import { useRouter } from "next/navigation";
import { ForceSignOutDialog } from "../components/utils/Dialog";

// ローディングを表示しないページ
const excludedPaths = [
    "/signin",
    "/signup",
    "/password",
    "/api/auth/error",
    "/forgot_password",
    "/reset_password",
    "/verify_email",
];

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
    const router = useRouter();
    const { data: session, status } = useSession();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const updateCurrentUser = (user: User) => setCurrentUser(() => user);
    const { signOut } = useAuth();
    const [isExpired, setIsExpired] = useState(false);

    const forceSignOut = async () => {
        await signOut();
        router.push("/signin");
    };

    useEffect(() => {
        try {
            if (!session?.token) return;
            auth.onAuthStateChanged(async (user) => {
                const token = await user?.getIdToken();

                // トークンがない場合はサインアウト
                if (!token) return;

                const res = await fetch(urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "users", "me"), {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.token}`,
                    },
                });

                console.log(res);
                

                if (res.statusText === "Unauthorized") {
                    setIsExpired(true);
                    return;
                }

                if (res.ok) {
                    const decoded = await res.json();
                    decoded?.data?.user && setCurrentUser(() => decoded?.data.user);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [session?.token]);

    if (isExpired) {
        return <ForceSignOutDialog open={true} handleExec={forceSignOut} />;
    }

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
