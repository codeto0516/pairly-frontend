"use server";

import axios from "axios";
import { setCookie } from "./cookies";
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
export const signIn = async (email: string, password: string): Promise<any> => {
    try {
        const res = await axios.post(`http://localhost/api/v1/auth/sign_in`, {
            email: email,
            password: password,
        });

        console.log(res);

        cookies().set("uid", res.headers["uid"], { secure: true });
        cookies().set("access-token", res.headers["access-token"], { secure: true });
        cookies().set("client", res.headers["client"], { secure: true });
        return await res.data;
    } catch (error) {
        return error;
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
    const res = await axios.post(`http://localhost/api/v1/auth/sign_in`, {
        ui: props.uid,
        "access-token": props.accessToken,
        client: props.client,
    });

    console.log(res.headers);

    return await res.data;
};
