"use server";
import { cookies } from "next/headers";

export const useCookie = () => {
    const getAllCookie = () => {
        return cookies().getAll();
    };

    const getCookie = (key: string) => {
        const cookie = cookies().get(key);
        console.log(cookie);

        return cookie;
    };

    const setCookie = (key: string, value: string) => {
        return cookies().set(key, value, { secure: true });
    };

    const deleteCookie = (key: string) => {
        return cookies().delete(key);
    };

    const getCookieTest = (key: string) => {
        
        const cookie = cookies().get("next-auth.session-token");
        console.log(cookie);

        return cookie;
    };

    return { getAllCookie, getCookie, setCookie, deleteCookie, getCookieTest };
};
