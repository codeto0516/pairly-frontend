import urlJoin from "url-join";
import { useApi } from "./useApi";

export const useCategory = () => {
    
    const api = useApi();

    const endPoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "categories");

    // const endPoint = urlJoin("https://api.pairly.life/api/v1", "categories");
    // const endPoint = urlJoin("http://localhost/api/v1", "categories");

    const getCategories = async (type: "spending" | "income"): Promise<any> => {
        const res: any = await api.get({
            // url: `${endPoint}/${type}`,
            url: urlJoin(endPoint, type),
            // cache: "force-cache",
        });
        console.log(await res);

        return await res;
    };

    return { getCategories };
};
