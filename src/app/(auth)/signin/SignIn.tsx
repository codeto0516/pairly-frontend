"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, LoadingButton } from "@mui/lab";
import { useAuth } from "@/src/hooks/useAuth";
import { Suspense, useEffect, useState } from "react";
import { MailField, PasswordField } from "@/src/components/elements/form/TextField";
import Loading from "../../loading";

type InvitationToken = string | null;

export const SignIn = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [invitationToken, setInvitationToken] = useState(token);

    return <SignInForm invitationToken={invitationToken} />;
};



const SignInForm = (props: { invitationToken: InvitationToken }) => {
    const { signIn, isLoading, signInWithGoogle } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        if (props.invitationToken) {
            signInWithGoogle(props.invitationToken);
        } else {
            signInWithGoogle();
        }
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null); // エラーメッセージをリセット
        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();
        if (email && password) {
            try {
                const res = await signIn(email, password);
            } catch (error: any) {
                console.log(error);

                setErrorMessage(error.message);
            }
        }
    };

    return (
        <Suspense fallback={<Loading />}>
            <div className="mt-2 flex flex-col items-center gap-4 w-3xl">
                <h1 className="text-xl">ログイン</h1>
                <button onClick={handleGoogleSignIn}>Googleでログイン</button>

                <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 w-full  sm:w-[380px] ">
                    <MailField />
                    <PasswordField />
                    <LoadingButton type="submit" fullWidth variant="outlined" className="h-14" loading={isLoading}>
                        ログイン
                    </LoadingButton>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
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
        </Suspense>
    );
};
