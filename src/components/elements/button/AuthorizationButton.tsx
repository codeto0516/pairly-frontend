"use client";

import { Button } from "@mui/material";
import { signIn, signOut } from "next-auth/react";

export const LoginButton = () => {
    return (
        <Button  onClick={() => signIn()}>
            ログイン
        </Button>
    );
};

export const LogoutButton = () => {
    return (
        <Button  onClick={() => signOut()}>
            ログアウト
        </Button>
    );
};
