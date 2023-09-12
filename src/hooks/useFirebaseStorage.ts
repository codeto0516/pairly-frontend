import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/src/app/(auth)/api/auth/[...nextauth]/config";
import { useUser } from "./useUser";
export const useFirebaseStorageImage = () => {
    const { currentUser } = useUser();

    // アップロード
    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            if (file.name) {
                const storageRef = ref(storage);

                // URLの作成
                const ext = file.name.split(".").pop();
                const hashName = Math.random().toString(36).slice(-8);
                const fullPath = `/images/${currentUser.uid}/${hashName}.${ext}`;

                // ストレージの参照を作成
                const uploadRef = ref(storageRef, fullPath);

                // 画像のアップロード
                await uploadBytes(uploadRef, file);
                const imageUrl = await getDownloadURL(uploadRef);
                return imageUrl;
            }
        } catch (error) {
            console.log(error);
        }

        return null;
    };

    // 削除
    const deleteImage = (photoURL: string) => {
        const storageRef = ref(storage, photoURL);
        return deleteObject(storageRef);
    };

    return { uploadImage, deleteImage };
};
