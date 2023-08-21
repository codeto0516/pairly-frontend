"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailField, ConfirmPasswordField, PasswordField } from "../../components/elements/form/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";

interface SingUpInputs {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function SignUp() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SingUpInputs>();
 

    const { signUp, currentUser, isLoading, signInWithGoogle } = useAuth();

    const onSubmit: SubmitHandler<SingUpInputs> = ({ email, password, confirmPassword }) => {
        if (password === confirmPassword) {
            signUp(email, password);
        } else {
            alert("パスワードが一致しません！");
        }
    };



    return (
        <div className="mt-2 flex flex-col items-center gap-4 w-full max-w-[360px]">
            <button onClick={signInWithGoogle}>Googleで新規登録</button>
            <h1 className="text-xl mb-8">新規登録</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-3 flex flex-col gap-3 w-full">
                <MailField register={register} />
                {errors.email && <p>メールアドレスは必須です</p>}
                <PasswordField register={register} />
                {errors.password && <p>パスワードは必須です</p>}
                <ConfirmPasswordField register={register} />
                {errors.confirmPassword && <p>パスワードは必須です</p>}
                <LoadingButton type="submit" fullWidth variant="outlined" className="h-14" loading={isLoading}>
                    登録
                </LoadingButton>
            </form>
            <div className="w-full">
                <Link href="/signin" className="text-sm text-blue-800 flex justify-end mt-4">
                    既にアカウントを持っている方はこちら
                </Link>
            </div>
        </div>
    );
}
