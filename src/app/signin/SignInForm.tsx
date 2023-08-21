"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/src/customHooks/providers/AuthProvider";
import { MailField, PasswordField } from "../../components/elements/form/TextField";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "@/src/customHooks/useAuth";
import { useSessions } from "@/src/customHooks/api/useSessions";

export const SignIn = () => {
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");
        if (email && password) {
            onSubmit(email.toString(), password.toString());
        }
    };

    const { signIn } = useSessions();

    const { dispatch } = useAuth();
    const onSubmit = async (email: string, password: string) => {
        const { userData, tokens } = await signIn({ email, password });

        if (userData && tokens) {
            // ログイン成功
            console.log("ログイン成功");
            await dispatch(loginAction(userData, tokens));
            router.push("/");
        } else {
            // ログイン失敗
            console.log("ログイン失敗");
        }
    };

    return (
        <div className="mt-2 flex flex-col items-center gap-4 w-3xl">
            <h1 className="text-xl">ログイン</h1>
            {/* <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 w-screen p-4 max-w-sm" > */}
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 w-full  sm:w-[380px] ">
                <MailField />
                <PasswordField />
                {/* <LoadingButton type="submit">ログイン</LoadingButton> */}
                <LoadingButton type="submit" fullWidth variant="outlined" className="h-14">
                    ログイン
                </LoadingButton>
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
    );
};
