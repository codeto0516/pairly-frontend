"use client";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import LoadingButton from "@mui/lab/LoadingButton";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/src/api/sessions";
import { useAuth } from "@/src/components/providers/AuthProvider";

export const SignIn = () => {
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<any>("");
    const handleErrorMessage = (errorMessage: any) => setErrorMessage(() => errorMessage);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");
        if (email && password) {
            onSubmit(email.toString(), password.toString());
        }
    };

    const {user, updateUser} = useAuth();
    const onSubmit = async (email: string, password: string) => {
        const userData = await signIn({email, password});
        if (userData) {
            // ログイン成功
            console.log("ログイン成功");
            console.log(userData);

            await updateUser(userData);
            router.push("/");
        } else {
            // ログイン失敗
            console.log("ログイン失敗");
        }
    };

    return (
        <div
            className="mt-2 flex flex-col items-center"
        >
            {/* <Button onClick={googleAuth}>hello</Button> */}
            {/* <div className="mb-8">
                <Logo />
            </div> */}
            <h1 className="text-xl">ログイン</h1>
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3  w-screen p-4 max-w-sm">
                {/* メールアドレス */}
                <TextField
                    required
                    className=""
                    id="email"
                    label="メールアドレス"
                    name="email"
                    autoComplete="email"
                    InputLabelProps={{ shrink: true }}
                />
                {/* パスワード */}
                <TextField
                    required
                    name="password"
                    label="パスワード"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    InputLabelProps={{ shrink: true }}
                />

                <FormControlLabel
                    control={<Checkbox value="rememberme" className="font-sm" />}
                    label="ログインを保持する(10日間)"
                    className="text-xs"
                />
                {errorMessage && <p>{errorMessage}</p>}
                <LoadingButton type="submit" fullWidth variant="outlined" className="h-14">
                    ログイン
                </LoadingButton>
                <div>
                    <Link href="/signup" className="text-sm text-blue-800 flex justify-end mt-4">
                        パスワードを忘れた方はこちら
                    </Link>
                    <Link href="/signup" className="text-sm text-blue-800 flex justify-end mt-4">
                        まだアカウントを登録していない方はこちら
                    </Link>
                </div>
            </form>
        </div>
    );
};
