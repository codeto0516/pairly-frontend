"use client";
import Link from "next/link";
import { LoadingButton } from "@/src/components/elements/button/LoadingButton";
import { useRouter } from "next/navigation";
import { MailField, PasswordConfirmField, PasswordField } from "../../components/elements/form/TextField";
import Button from "@mui/material/Button";

export default function SignUp() {
    const router = useRouter();

    const handleSubmit = async () => {
        throw new Error("エラー");
    };

    return (
        <div className="mt-2 flex flex-col items-center gap-4 w-full max-w-[360px]">
            <h1 className="text-xl mb-8">新規登録</h1>
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 w-full">
                <MailField />
                <PasswordField />
                <PasswordConfirmField />
                <Button type="submit"></Button>
            </form>
            <div className="w-full">
                <Link href="/signin" className="text-sm text-blue-800 flex justify-end mt-4">
                    既にアカウントを持っている方はこちら
                </Link>
            </div>
        </div>
    );
}
