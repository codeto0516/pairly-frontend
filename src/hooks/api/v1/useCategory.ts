import urlJoin from "url-join";
import { useApi } from "./useApi";

export const useCategory = () => {
    
    const api = useApi();

    const endPoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "categories");

    const getCategories = async (type: "spending" | "income"): Promise<any> => {
        const res: any = await api.get({
            url: urlJoin(endPoint, type),
            cache: "force-cache",
        });

        return await res;
    };

    return { getCategories };
};
