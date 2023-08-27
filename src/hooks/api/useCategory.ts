import { useUserData } from "@/src/providers/SessionProvider";
import { useApi } from "./useApi";




export const useCategory = () => {
    
    const api = useApi();

    const endPoint = "http://192.168.1.10:80/api/v1/categories";

    const getAllCategories = async (type: "spending" | "income"): Promise<any> => {
        const res: any = await api.get({
            url: `${endPoint}/${type}`,
            cache: "force-cache",
        })
        return await res.json();
    };

    return { getAllCategories };
};
