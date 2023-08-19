"use server";
import { cookies } from "next/headers";


export const setCookie = () => {
    cookies().set("test", "testdesu", { secure: true });
};
