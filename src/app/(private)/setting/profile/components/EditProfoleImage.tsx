import { Avatar } from "@mui/material";

interface EditProfoleImageProps {
    imageFile: File | null;
    changeImageFile: (newImageFile: File) => void;
    previewPhotoURL: string | null;
    changePreviewPhotoURL: (newPreviewPhotoURL: string) => void;
}

export const EditProfoleImage = (props: EditProfoleImageProps) => {
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        const selectedImage = event.target.files[0];

        if (selectedImage instanceof File) {
            props.changeImageFile(selectedImage);
            props.changePreviewPhotoURL(URL.createObjectURL(selectedImage));
        }
    };

    return (
        <div className="relative overflow-hidden rounded-full w-fit">
            <Avatar alt="プロフィール画像" src={props.previewPhotoURL ?? undefined} sx={{ width: 100, height: 100 }} />
            <label htmlFor="image" className="absolute bottom-0 left-0 right-0 text-center cursor-pointer">
                <div className="bg-black bg-opacity-60">
                    <p className="text-[10px] text-white pb-1.5 pt-1 hover:opacity-80">変更する</p>
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
