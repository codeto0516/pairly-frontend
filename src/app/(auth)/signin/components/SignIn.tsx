"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, LoadingButton } from "@mui/lab";
import { Suspense, useEffect, useState } from "react";
import Loading from "../../../loading";
import { Backdrop, CircularProgress } from "@mui/material";
import { GoogleSignInButton } from "@/src/components/inputs/button/GoogleSignButton";
import { MailField, PasswordField } from "@/src/components/inputs/textField/TextField";
import { useAuth } from "@/src/hooks/useAuth";

type InvitationToken = string | null;
export const SignIn = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [invitationToken, setInvitationToken] = useState(token);

    return <SignInForm invitationToken={invitationToken} />;
};

const SignInForm = (props: { invitationToken: InvitationToken }) => {
    const { signInWithEmailAndPassword, isLoading, signInWithGoogle, errorMessage } = useAuth();

    const handleGoogleSignIn = async () => {
        props.invitationToken ? signInWithGoogle(props.invitationToken) : signInWithGoogle();
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();
        if (email && password) {
            await signInWithEmailAndPassword(email, password);
        }
    };

    return (
        <Suspense fallback={<Loading />}>
            <div className="mt-2 flex flex-col items-center gap-4 sm:gap-8 w-full max-w-[380px]">
                <h1 className="text-xl mb-4">ログイン</h1>
                <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                    <CircularProgress color="inherit" />
                </Backdrop>

                <GoogleSignInButton onClick={handleGoogleSignIn} />

                <hr className="border w-full"></hr>
                <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 w-full">
                    <MailField />
                    <PasswordField />
                    <LoadingButton type="submit" fullWidth variant="outlined" className="h-14" loading={false}>
                        {isLoading ? "ログイン中..." : "ログイン"}
                    </LoadingButton>

                    {/* エラーメッセージ */}
                    {errorMessage && (
                        <Alert severity="error" sx={{ width: "100%" }}>
                            {errorMessage}
                        </Alert>
                    )}
                </form>
                <div className="w-full px-4">
                    <Link href="/password" className="text-sm text-blue-800 flex justify-end mt-4">
                        パスワードを忘れた方はこちら
                    </Link>
                    <Link href="/signup" className="text-sm text-blue-800 flex justify-end mt-4">
                        まだアカウントを登録していない方はこちら
                    </Link>
                </div>
            </div>
        </Suspense>
    );
};
