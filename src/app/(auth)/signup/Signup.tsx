"use client";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { MailField, ConfirmPasswordField, PasswordField } from "../../../components/elements/form/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { Alert, LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { GoogleSignUpButton } from "@/src/components/elements/button/GoogleSignButton";
import { Backdrop, CircularProgress } from "@mui/material";

type InvitationToken = string | null;

export const SignUp = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [invitationToken, setInvitationToken] = useState<InvitationToken>(token);

    return <SignUpForm invitationToken={invitationToken} />;
};

const SignUpForm = (props: { invitationToken: InvitationToken }) => {
    const { signInWithGoogle, signUpWithEmailAndPassword,isLoading, errorMessage } = useAuth();

    const handleGoogleSignIn = async () => {
        if (props.invitationToken) {
            signInWithGoogle(props.invitationToken);
        } else {
            signInWithGoogle();
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();
        const confirmPassword = data.get("password")?.toString();
        if (password === confirmPassword && email && password) {
            await signUpWithEmailAndPassword(email, password);
        } else {
            alert("パスワードが一致しません！");
        }
    };

    return (
        <div className="mt-2 flex flex-col items-center gap-4 sm:gap-8 w-full max-w-[380px]">
            <h1 className="text-xl mb-4">新規登録</h1>

            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <GoogleSignUpButton onClick={handleGoogleSignIn} />

            <hr className="border w-full" />

            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 w-full">
                <MailField />
                <PasswordField />
                <ConfirmPasswordField />
                <LoadingButton type="submit" fullWidth variant="outlined" className="h-14">
                    {isLoading ? "登録中..." : "登録"}
                </LoadingButton>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </form>
            <div className="w-full px-4">
                {props.invitationToken ? (
                    <Link
                        href={`/signin?token=${props.invitationToken}`}
                        className="text-sm text-blue-800 flex justify-end mt-4"
                    >
                        既にアカウントを持っている方はこちら
                    </Link>
                ) : (
                    <Link href="/signin" className="text-sm text-blue-800 flex justify-end mt-4">
                        既にアカウントを持っている方はこちら
                    </Link>
                )}
            </div>
        </div>
    );
};
