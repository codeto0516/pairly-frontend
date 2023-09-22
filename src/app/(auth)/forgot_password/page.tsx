"use client";
import { Alert, LoadingButton } from "@mui/lab";
import { MailField } from "@/src/components/inputs/textField/TextField";
import { useAuth } from "@/src/hooks/useAuth";
import { LinkPrimary } from "@/src/components/navigation/Link";

const Page = () => {
    const { sendPasswordResetEmail, isLoading, successMessage, errorMessage } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        if (email) {
            sendPasswordResetEmail(email);
        }
    };

    return (
        <div className="mt-2 flex flex-col items-center gap-4 sm:gap-8 w-full max-w-[380px]">
            <h1 className="text-xl mb-4">パスワード再設定メールを送る</h1>

            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 w-full">
                <MailField />
                <LoadingButton type="submit" fullWidth variant="outlined" className="h-14" disabled={isLoading}>
                    {isLoading ? "送信中..." : "送信"}
                </LoadingButton>
                {/* エラーメッセージ */}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {/* 成功メッセージ */}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
            </form>
            <div className="w-full flex justify-center">
                <LinkPrimary href="/signin">ログイン画面に戻る</LinkPrimary>
            </div>
        </div>
    );
};

export default Page;
