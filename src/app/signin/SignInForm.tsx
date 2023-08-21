"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "@/src/hooks/useAuth";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MailField, PasswordField } from "@/src/components/elements/form/TextField";

interface SingInInputs {
    email: string;
    password: string;
}
export const SignIn = () => {
    const router = useRouter();

    const { signIn, currentUser, isLoading,signInWithGoogle } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SingInInputs>();

    // const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const onSubmit: SubmitHandler<SingInInputs> = ({ email, password }) => {
        signIn(email, password);
    };

    

    return (
        <div className="mt-2 flex flex-col items-center gap-4 w-3xl">
            <h1 className="text-xl">ログイン</h1>
            <button onClick={signInWithGoogle}>Googleでログイン</button>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-3 flex flex-col gap-3 w-full  sm:w-[380px] ">
                <MailField register={register} />
                <PasswordField register={register} />
                <LoadingButton type="submit" fullWidth variant="outlined" className="h-14" loading={isLoading}>
                    ログイン
                </LoadingButton>
            </form>

            <div className="w-full px-4">
                <Link href="/signup" className="text-sm text-blue-800 flex justify-end mt-4">
                    パスワードを忘れた方はこちら
                </Link>
                <Link href="/signup" className="text-sm text-blue-800 flex justify-end mt-4">
                    まだアカウントを登録していない方はこちら
                </Link>
            </div>
        </div>
    );
};
