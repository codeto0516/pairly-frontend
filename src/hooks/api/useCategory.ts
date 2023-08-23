import { useUserData } from "@/src/providers/SessionProvider";
import { useApi } from "./useApi";

export const useCategory = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const convertUrl = (path: string) => new URL(path, baseUrl).toString();

    const api = useApi();

    const user = useUserData()

    const getAllCategories = async () => {
        if (!user?.token) return null

        const res = await fetch("http://localhost:80/api/v1/categories", {
            // cache: "force-cache",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        });
        console.log(res.json())
        
    };

    return {
        getAllCategories,
    };
};
