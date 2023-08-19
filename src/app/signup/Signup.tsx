"use client";
import TextField from "@mui/material/TextField";
import Link from "next/link";
import Logo from "@/src/components/layouts/Header/Logo";
import { LoadingButton } from "@/src/components/elements/button/LoadingButton";
import { useRouter } from "next/navigation";

export default function SignUp() {

    const router = useRouter();


    const handleSubmit = async () => {
        console.log("hello!");
        // router.push("/")
        throw new Error("エラー");
    };

    return (
        <div className="mt-2 flex flex-col items-center w-fit">
            {/* <div className="mb-8">
                <Logo />
            </div> */}

            <h1 className="text-xl">新規登録</h1>
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3  w-screen p-4 max-w-sm">
                {/* メールアドレス */}
                <TextField required className="" id="email" label="メールアドレス" name="email" autoComplete="email" />
                {/* パスワード */}
                <TextField
                    required
                    name="password"
                    label="パスワード"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                />
                {/* パスワード確認用 */}
                <TextField
                    required
                    name="password"
                    label="パスワード（確認用）"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                />
                {/* <FormControlLabel
                    control={<Checkbox value="rememberme" className="font-sm" />}
                    label="ログインを保持する(10日間)"
                    className="text-xs"
                /> */}
                {/* <LoadingButton type="submit" fullWidth variant="outlined" className="h-14 mt-4">
                    登録
                </LoadingButton> */}
                <LoadingButton onClick={handleSubmit}>登録</LoadingButton>

                <Link href="/login" className="text-sm text-blue-800 flex justify-end mt-4">
                    既にアカウントを持っている方はこちら
                </Link>
            </form>
        </div>
    );
}
