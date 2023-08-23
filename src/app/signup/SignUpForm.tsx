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
    const { signInWithGoogle, signUp } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");
        const confirmPassword = data.get("password");
        if (email && password && password === confirmPassword) {
            signUp(email.toString(), password.toString());
        } else {
            alert("パスワードが一致しません！");
        }
    };

    return (
        <div className="mt-2 flex flex-col items-center gap-4 w-full max-w-[360px]">
            <button onClick={signInWithGoogle}>Googleで新規登録</button>
            <h1 className="text-xl mb-8">新規登録</h1>
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 w-full">
                <MailField />
                <PasswordField />
                <ConfirmPasswordField />
                <LoadingButton type="submit" fullWidth variant="outlined" className="h-14">
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
