"use client";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Alert, LoadingButton } from "@mui/lab";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/src/app/loading";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { GoogleSignInButton } from "@/src/components/inputs/button/GoogleSignButton";
import { MailField, PasswordField } from "@/src/components/inputs/textField/TextField";
import { useAuth } from "@/src/hooks/useAuth";

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const oobCode = searchParams.get("oobCode");

    const { resetPassword, isLoading, successMessage, errorMessage } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const newPassword = data.get("password")?.toString();
        const result = await resetPassword(newPassword, oobCode);
        if (result) {
            router.push("/signin")
        }
    };

    return (
        <Suspense fallback={<Loading />}>
            <div className="mt-2 flex flex-col items-center gap-4 sm:gap-8 w-full max-w-[380px]">
                <h1 className="text-xl mb-4">パスワード再設定</h1>

                <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 w-full">
                    <PasswordField />
                    <LoadingButton type="submit" fullWidth variant="outlined" className="h-14" loading={isLoading}>
                        {isLoading ? "パスワードを変更中..." : "パスワードを変更"}
                    </LoadingButton>
                    {/* エラーメッセージ */}
                    {errorMessage && (
                        <Alert severity="error" sx={{ width: "100%" }}>
                            {errorMessage}
                        </Alert>
                    )}
                    {/* 成功メッセージ */}
                    {successMessage && (
                        <Alert severity="success" sx={{ width: "100%" }}>
                            {successMessage}
                        </Alert>
                    )}
                </form>
                <div className="w-full flex justify-center">
                    <Link href="/signin" className="text-sm text-blue-800 flex justify-end mt-4">
                        ログイン画面に戻る
                    </Link>
                </div>
            </div>
        </Suspense>
    );
};

export default Page;
