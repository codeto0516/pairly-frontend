"use client";

import { useUserData } from "@/src/providers/SessionProvider";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Avatar } from "@mui/material";
import { useApi } from "@/src/hooks/api/v1/useApi";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/src/app/(auth)/api/auth/[...nextauth]/config";

export const ProfileEditForm = () => {
    const { user, setUser } = useUserData();
    const [editingData, setEditingData] = useState(user);
    const changeEditingData = (field: any, value: any) => {
        setEditingData({ ...editingData, [field]: value });
    };

    const api = useApi();

    const postImage = async (image: any) => {
        let uploadResult = "";

        if (image.name) {
            const storageRef = ref(storage);
            const ext = image.name.split(".").pop();
            const hashName = Math.random().toString(36).slice(-8);
            const fullPath = "/images/" + hashName + "." + ext;
            const uploadRef = ref(storageRef, fullPath);

            // 'file' comes from the Blob or File API
            await uploadBytes(uploadRef, image).then(async function (result) {
                console.log(result);
                console.log("Uploaded a blob or file!");

                await getDownloadURL(uploadRef).then(function (url) {
                    uploadResult = url;
                });
            });
        }

        return uploadResult;
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const url = await postImage(editingData.image);

        const res: any = await api.put({
            url: `http://localhost/api/v1/users/${user.id}`,
            data: {
                name: editingData.name,
                image: url,
            },
        });

        if (res.error) {
            return;
        }
        if (res.user) {
            const userData = await res.user;
            console.log(userData);

            setUser(() => userData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 justify-center items-center w-[300px]">
            <EditProfoleImage editingData={editingData} changeEditingData={changeEditingData} />
            <TextField
                id="name"
                label="名前"
                value={editingData.name}
                onChange={(e: any) => changeEditingData("name", e.target.value)}
                sx={{ width: "100%" }}
            />
            <LoadingButton type="submit" variant="outlined" sx={{ width: "100%", height: "50px" }}>
                更新
            </LoadingButton>
        </form>
    );
};

const EditProfoleImage = (props: { editingData: any; changeEditingData: any }) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageChange = (event: any) => {
        const selectedImage = event.target.files[0];
        // console.log(event.target.files);

        if (selectedImage instanceof File) {
            props.changeEditingData("image", selectedImage);
            setPreviewImage(() => URL.createObjectURL(selectedImage));
        }
    };

    return (
        <div className="relative overflow-hidden rounded-full w-fit">
            <Avatar
                alt={props.editingData.email ?? ""}
                src={previewImage ? previewImage : props.editingData.image}
                sx={{ width: 100, height: 100 }}
            />
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
