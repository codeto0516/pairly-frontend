"use client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "next/link";
import LoadingButton from "@mui/lab/LoadingButton";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Page() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "authenticated") {
        router.push("/report");
    }

    const [errorMessage, setErrorMessage] = useState<any>("");
    const handleErrorMessage = (errorMessage: any) => setErrorMessage(() => errorMessage);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get("email");
        const password = data.get("password");
        onSubmit(email, password);
    };

    const onSubmit = async (email: FormDataEntryValue | null, password: FormDataEntryValue | null) => {
        try {
            await signIn("credentials", {
                redirect: false,
                email,
                password,
            }).then((res) => {
                console.log(res);

                if (res?.error) {
                    handleErrorMessage(res.error);
                } else {
                    router.push("/");
                }
            });
        } catch (err: any) {
            // handleErrorMessage(err);
            console.log(err);
        }
    };

    const googleAuth = async () => {
        try {
            await signIn("google", {
                redirect: false,
            }).then((res) => {
                console.log(res);

                if (res?.error) {
                    handleErrorMessage(res.error);
                } else {
                    router.push("/");
                }
            });
        } catch (err: any) {
            console.log(err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="mt-2 flex flex-col items-center"
        >
            <Button onClick={googleAuth}>hello</Button>
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
        </motion.div>
    );
}
