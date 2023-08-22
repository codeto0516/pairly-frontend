"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../useAuth";
import Loading from "@/src/app/loading";
import { User } from "firebase/auth";

export type GlobalAuthState = {
    user: User | null | undefined;
};
const initialState: GlobalAuthState = {
    user: undefined,
};

const AuthContext = createContext<GlobalAuthState>(initialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<GlobalAuthState>(initialState);

    const { auth, currentUser } = useAuth();

    useEffect(() => {
        try {
            return auth.onAuthStateChanged((user) => {
                setUser({
                    user,
                });
            });
        } catch (error) {
            setUser(initialState);
            throw error;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

// "use client";
// import { useEffect, useState } from "react";

// import { usePathname, useRouter } from "next/navigation";
// import { useAuth } from "../useAuth";
// import Loading from "@/src/app/loading";

// export const AuthProvider = ({ children }: { children: React.ReactElement }) => {
//     const router = useRouter();
//     const pathName = usePathname();
//     const { auth, currentUser } = useAuth();
//     const [isCheking, setIsCheking] = useState(true);

//     useEffect(() => {
//         return auth.onAuthStateChanged((user) => {
//             console.log("ログインチェック監視");
//             // console.log(user);

//             if (!user && pathName != "/signin" && pathName != "/signup") {
//                 router.push("/signin");
//             }

//             setIsCheking(() => false);
//         });
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     if (isCheking) {
//         return <Loading />;
//     } else {
//         return children;
//     }
// };
