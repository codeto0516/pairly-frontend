import { SessionContext, useUserData } from "@/src/providers/SessionProvider";
import { useApi } from "./useApi";
import { updateProfile } from "firebase/auth";

import { useContext } from "react";
import { auth } from "@/src/app/(auth)/api/auth/[...nextauth]/config";
import urlJoin from "url-join";

export const useUser = () => {
    const api = useApi();

    const endPoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "users");

    const { currentUser, setCurrentUser } = useUserData();

    const getUser = async (userId: string) => {
        if (userId === currentUser.uid) return currentUser;

        const res: any = await api.get({
            url: urlJoin(endPoint, userId),
            cache: "force-cache",
        });

        const data = await res.data;

        return data?.user;
    };

    const editUser = async (displayName: string, photoURL: string) => {
        if (!auth.currentUser) return false;

        try {
            // ユーザーのプロフィール情報を更新
            await updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: photoURL,
            });

            
            

            // プロフィール情報が更新されたら、コンテキスト内のユーザー情報も更新
            setCurrentUser((prevUserData: any) => ({
                ...prevUserData,
                displayName: displayName,
                photoURL: photoURL,
            }));

            console.log("プロフィールの更新に成功しました！");
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    return { currentUser, getUser, editUser };
};
