"use client";

import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Alert, Avatar, Snackbar } from "@mui/material";
import { useUser } from "@/src/hooks/api/v1/useUser";
import { useFirebaseStorageImage } from "@/src/hooks/useFirebaseStorage";
import { useToggle } from "@/src/hooks/useToggle";

//////////////////////////////////////////////////////////////////////////////////////////
// 本体
//////////////////////////////////////////////////////////////////////////////////////////
export const ProfileEditForm = () => {
    const { getUser } = useUser();

    const { currentUser } = useUser();
    const { editUser } = useUser();
    const { uploadImage, deleteImage } = useFirebaseStorageImage();
    

    const [displayName, setDisplayName] = useState(currentUser.displayName);
    const [imageFile, setImageFile] = useState(currentUser.photoURL);
    const changeDisplayName = (newDisplayName: string) => setDisplayName(() => newDisplayName);
    const changeImageFile = (newImageFile: string) => setImageFile(() => newImageFile);

    const [loading, loadingToggle] = useToggle(false);

    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    const handleSubmit = async (event: any) => {
        console.log(displayName, imageFile);
        
        // ローディング開始
        loadingToggle(true);

        // デフォルトのイベントをキャンセル
        event.preventDefault();

        // Firebase Storageに画像をアップロード
        const imageUrl = await uploadImage(imageFile);

        // Firebase Authのユーザー情報を更新
        const res = await editUser(displayName, imageUrl ?? currentUser.photoURL);

        if (res) {
            setIsSuccess(true);
        } else {
            setIsSuccess(false);
        }

        // ローディング終了
        loadingToggle(false);

        setTimeout(() => {
            setIsSuccess(null);
        }, 5000);
    };



    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 justify-center items-center w-[300px]">
            <EditProfoleImage imageFile={imageFile} changeImageFile={changeImageFile} />
            <TextField
                id="displayName"
                label="名前"
                value={displayName}
                onChange={(e: any) => changeDisplayName(e.target.value)}
                sx={{ width: "100%" }}
            />
            <LoadingButton type="submit" variant="outlined" sx={{ width: "100%", height: "50px" }} loading={loading}>
                更新
            </LoadingButton>
            {isSuccess === null ? (
                <></>
            ) : isSuccess ? (
                <Alert severity="success" sx={{ width: "100%" }}>
                    更新に成功しました。
                </Alert>
            ) : (
                <Alert severity="error" sx={{ width: "100%" }}>
                    更新に失敗しました。
                </Alert>
            )}
        </form>
    );
};

//////////////////////////////////////////////////////////////////////////////////////////
// 画像選択
//////////////////////////////////////////////////////////////////////////////////////////
const EditProfoleImage = (props: { imageFile: any; changeImageFile: any }) => {
    const [previewPhotoURL, setPreviewPhotoURL] = useState<string | null>(null);

    const handleImageChange = (event: any) => {
        const selectedImage = event.target.files[0];

        if (selectedImage instanceof File) {
            props.changeImageFile(selectedImage);
            setPreviewPhotoURL(() => URL.createObjectURL(selectedImage));
        }
    };

    return (
        <div className="relative overflow-hidden rounded-full w-fit">
            <Avatar alt="プロフィール画像" src={previewPhotoURL ?? props.imageFile} sx={{ width: 100, height: 100 }} />
            <label htmlFor="image" className="absolute bottom-0 left-0 right-0 text-center cursor-pointer">
                <div className="bg-black bg-opacity-60">
                    <p className="text-[10px] text-white pb-1.5 pt-1">変更する</p>
                </div>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                />
            </label>
        </div>
    );
};