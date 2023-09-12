import { useUserData } from "@/src/providers/SessionProvider";
import { updateProfile } from "firebase/auth";
import { auth } from "@/src/app/(auth)/api/auth/[...nextauth]/config";
import urlJoin from "url-join";
import { useApi } from "./useApi";
import { useRouter } from "next/navigation";

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

    const editUser = async (displayName: string, imageFile: any) => {
        if (!auth.currentUser) return false;

        try {
            // ユーザーのプロフィール情報を更新
            // await updateProfile(auth.currentUser, {
            //     displayName: displayName,
            //     photoURL: photoURL,
            // });


            const formData = new FormData();
            formData.append("displayName", displayName);
            formData.append("image", imageFile);

            
            const res: any = await api.put({
                url: urlJoin(endPoint, currentUser.uid),
                data: formData,
            });

            const data = await res.data;
            const user = data.user;

            // プロフィール情報が更新されたら、コンテキスト内のユーザー情報も更新
            setCurrentUser((prevUserData: any) => ({
                ...prevUserData,
                displayName: displayName,
                photoURL: user.photoURL,
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
