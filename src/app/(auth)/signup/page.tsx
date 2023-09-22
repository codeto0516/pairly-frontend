"use client";
import { Alert, LoadingButton } from "@mui/lab";
import { Backdrop, CircularProgress } from "@mui/material";
import { MailField, ConfirmPasswordField, PasswordField } from "@/src/components/inputs/textField/TextField";
import { GoogleSignUpButton } from "@/src/components/inputs/button/GoogleSignButton";
import { useAuth } from "@/src/hooks/useAuth";
import { LinkPrimary } from "@/src/components/navigation/Link";

const Page = () => {
    return <SignUp />;
};

export default Page;

const SignUp = () => {
    const { signInWithGoogle, signUpWithEmailAndPassword, isLoading, errorMessage } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        const password = data.get("password")?.toString();
        const confirmPassword = data.get("conformPassword")?.toString();
        if (email && password && confirmPassword) {
            await signUpWithEmailAndPassword(email, password, confirmPassword);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 sm:gap-8 w-full max-w-[380px]">
            <h1 className="text-xl mb-4">新規登録</h1>

            <GoogleSignUpButton onClick={signInWithGoogle} />

            <hr className="border w-full" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                <MailField />
                <PasswordField />
                <ConfirmPasswordField />
                <LoadingButton type="submit" fullWidth variant="outlined" className="h-14" disabled={isLoading}>
                    {isLoading ? "登録中..." : "登録"}
                </LoadingButton>

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            </form>
            <div className="flex flex-col items-end w-full">
                <LinkPrimary href="/signin">既にアカウントを持っている方はこちら</LinkPrimary>
            </div>

            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};
