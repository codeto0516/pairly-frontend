"use client";

import { getAllCookie, getAllToken } from "@/src/api/cookies";
import { usePathname, useRouter, redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface UserType {
    id: number;
    email: string;
    nickname?: string;
}

interface TokensType {
    uid: string;
    accessToken: string;
    client: string;
}

const AuthContext = createContext<any>({});
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathName = usePathname()

    const [user, setUser] = useState<any>();


    const updateUser = (newData: any) => {
        // setUser((prevUserData: any) => ({
        //     ...prevUserData,
        //     [field]: value,
        // }));
        // console.log(newData);

        setUser(() => newData);
        // console.log(user);
    };

    const [tokens, setTokens] = useState<TokensType | undefined | null>(undefined);
    const updateTokens = (newTokens: TokensType) => {
        setTokens(() => newTokens);
    };

    // ログイン判定処理
    useEffect(() => {
        {
            (async () => {
                const userAllToken = await getAllToken();

                const { uid, accessToken, client } = userAllToken;
                if (uid?.value && accessToken?.value && client?.value) {
                    console.log("ログインしています");
                    
                    updateTokens({ uid: uid.value, accessToken: accessToken.value, client: client.value });
                } else {
                    router.push("/signin");
                    
                }
            })();
        }
    }, [router, pathName]);

    useEffect(() => {
        
    }, [])

    return <AuthContext.Provider value={{ user, updateUser, tokens }}>{children}</AuthContext.Provider>;
};
