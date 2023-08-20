"use server";

import axios from "axios";
import { deleteAllToken, setCookie } from "./cookies";
import { cookies } from "next/headers";

interface UserResponseType {
    allow_password_change: true;
    email: string;
    id: number;
    image: string | null;
    name: string;
    nickname: string | null;
    provider: string;
    uid: string;
}
///////////////////////////////////////////////////////////////////////////////////////
// ログイン
///////////////////////////////////////////////////////////////////////////////////////
interface signInProps {
    email: string;
    password: string;
}
export const signIn = async (props: signInProps): Promise<any> => {
    try {
        const res = await axios.post(`http://localhost/api/v1/auth/sign_in`, {
            email: props.email,
            password: props.password,
        });

        console.log(res.status, res.statusText);
        switch (res.status) {
            case 200:
                cookies().set("uid", res.headers["uid"], { secure: true });
                cookies().set("access-token", res.headers["access-token"], { secure: true });
                cookies().set("client", res.headers["client"], { secure: true });
                return res.data;
            default:
                return false;
        }
    } catch (error) {
        return "error";
    }
};

///////////////////////////////////////////////////////////////////////////////////////
// ログアウト
///////////////////////////////////////////////////////////////////////////////////////
interface signOutProps {
    uid: string;
    accessToken: string;
    client: string;
}
export const signOut = async (props: signOutProps): Promise<any> => {
    // console.log("ログアウト開始");
    // console.log(props);

    try {
        const headers = {
            uid: props.uid,
            "access-token": props.accessToken,
            client: props.client,
        };

        const res = await axios.delete(`http://localhost/api/v1/auth/sign_out`, { headers });
        console.log(res.status, res.statusText);

        switch (res.status) {
            case 200:
                deleteAllToken();
                return true;
            default:
                return false;
        }
    } catch (error) {
        return "error";
    }
};
