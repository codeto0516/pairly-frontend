"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "./AuthProvider";
import Loading from "@/src/app/loading";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthContext();
    const router = useRouter();
    const pathName = usePathname();

    

    if (typeof user === "undefined") {
        return <Loading />;
    }

    if (user === null) {
        if (pathName != "/signin" && pathName != "/signup") {
            router.push("/signin");
        }
        // return null;
    }

    return <>{children}</>;
};
