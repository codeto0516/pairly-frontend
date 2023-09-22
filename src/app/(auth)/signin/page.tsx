"use client";
import { Alert, LoadingButton } from "@mui/lab";
import { Backdrop, CircularProgress } from "@mui/material";
import { GoogleSignInButton } from "@/src/components/inputs/button/GoogleSignButton";
import { MailField, PasswordField } from "@/src/components/inputs/textField/TextField";
import { useAuth } from "@/src/hooks/useAuth";
import { LinkPrimary } from "@/src/components/navigation/Link";

const Page = () => {
    return <SignIn />;
};

export default Page;

const SignIn = () => {
    const { signInWithEmailAndPassword, signInWithGoogle, isLoading, errorMessage } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();
        if (email && password) {
            await signInWithEmailAndPassword(email, password);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 sm:gap-8 w-full max-w-[380px]">
            <h1 className="text-xl mb-4">ログイン</h1>

            <GoogleSignInButton onClick={signInWithGoogle} />

            <hr className="border w-full"></hr>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                <MailField />
                <PasswordField />
                <LoadingButton type="submit" fullWidth variant="outlined" className="h-14" disabled={isLoading}>
                    {isLoading ? "ログイン中..." : "ログイン"}
                </LoadingButton>

                {/* エラーメッセージ */}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </form>
            <div className="flex flex-col items-end w-full">
                <LinkPrimary href="/forgot_password">パスワードを忘れた方はこちら</LinkPrimary>
                <LinkPrimary href="/signup">アカウントを登録していない方はこちら</LinkPrimary>
            </div>

            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};
