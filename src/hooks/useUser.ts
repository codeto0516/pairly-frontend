import { useUserData } from "@/src/providers/SessionProvider";
import urlJoin from "url-join";
import { useApi } from "./useApi";
import { User } from "../types/user";
import { converImageToBlob } from "../app/(private)/(home)/lib/converImageToBlob";

export const useUser = () => {
    const api = useApi();
    const endPoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "users");
    const { currentUser, updateCurrentUser } = useUserData();

    const getUser = async (userId: string) => {
        if (!currentUser) return false;
        if (userId === currentUser.localId) return currentUser;
        if (userId === currentUser.partner?.localId) return currentUser.partner;

        const res: any = await api.get({
            url: urlJoin(endPoint, userId),
            cache: "force-cache",
        });

        const data = await res?.data;

        return data?.user;
    };

    const editUser = async (displayName: string, imageFile: File) => {
        if (!currentUser) return false;

        try {
            // フォームデータに変換
            const formData = new FormData();
            displayName && formData.append("displayName", displayName);

            if (imageFile) {
                // 画像の圧縮
                const compressImageFile = await converImageToBlob({
                    file: imageFile,
                    height: 100,
                    quality: 0.5,
                });
                imageFile && formData.append("image", compressImageFile);
            }

            // プロフィール情報を更新
            const res: any = await api.put({
                url: urlJoin(endPoint, currentUser?.localId),
                data: formData,
            });

            if (!res.ok) throw new Error(res.statusText);
            if (!res.data) throw new Error("データがありません。");
            if (!res.data.user) throw new Error("ユーザーが見つかりません。");

            const user: User = res.data.user;

            // プロフィール情報が更新されたら、コンテキスト内のユーザー情報も更新
            updateCurrentUser(user);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    return { currentUser, getUser, editUser };
};
