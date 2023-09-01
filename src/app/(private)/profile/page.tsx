import { ProfileEditForm } from "./components/ProfileEditForm";

const page = () => {
    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <h1 className="text-lg font-bold">プロフィール編集</h1>

            <ProfileEditForm />
        </div>
    );
};

export default page;
