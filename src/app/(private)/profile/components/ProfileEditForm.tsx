"use client";

import TextField from "@mui/material/TextField";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Alert } from "@mui/material";
import { useToggle } from "@/src/hooks/useToggle";
import { useUser } from "@/src/hooks/useUser";
import { EditProfoleImage } from "./EditProfoleImage";
//////////////////////////////////////////////////////////////////////////////////////////
// 本体
//////////////////////////////////////////////////////////////////////////////////////////
export const ProfileEditForm = () => {
    const { currentUser } = useUser();
    const { editUser } = useUser();

    const [displayName, setDisplayName] = useState(currentUser?.displayName ?? "");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewPhotoURL, setPreviewPhotoURL] = useState<string | null>(currentUser?.photoUrl ?? null);
    const changeDisplayName = (newDisplayName: string) => setDisplayName(() => newDisplayName);
    const changeImageFile = (newImageFile: File) => setImageFile(() => newImageFile);
    const changePreviewPhotoURL = (newPreviewPhotoURL: string) => setPreviewPhotoURL(() => newPreviewPhotoURL);

    const [loading, loadingToggle] = useToggle(false);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setIsSuccess(null);

        // ローディング開始
        loadingToggle(true);

        // デフォルトのイベントをキャンセル
        e.preventDefault();

        // Firebase Authのユーザー情報を更新
        const res = await editUser(displayName, imageFile);

        if (res) {
            setIsSuccess(true);
        } else {
            setIsSuccess(false);
        }

        // ローディング終了
        loadingToggle(false);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-center items-center w-[300px]">
            {/* 画像表示・変更ボタン */}
            <EditProfoleImage
                imageFile={imageFile}
                changeImageFile={changeImageFile}
                previewPhotoURL={previewPhotoURL}
                changePreviewPhotoURL={changePreviewPhotoURL}
            />

            {/* 名前入力フィールド */}
            <TextField
                id="displayName"
                label="名前"
                value={displayName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeDisplayName(e.target.value)}
                sx={{ width: "100%" }}
            />

            {/* 更新ボタン */}
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
