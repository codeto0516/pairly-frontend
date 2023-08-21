"use server";
import { cookies } from "next/headers";


export const setCookie = () => {
    cookies().set("test", "testdesu", { secure: true });
};

export const getAllCookie = () => {
    console.log("hello!");
    
    console.log(cookies().getAll());
    
    return cookies().getAll()
};

export const getAllToken = () => {
    const uid = cookies().get("uid");
    const accessToken = cookies().get("access-token");
    const client = cookies().get("client");
    return {uid, accessToken, client}
};


export const deleteAllToken = () => {
    const uid = cookies().delete("uid");
    const accessToken = cookies().delete("access-token");
    const client = cookies().delete("client");
};