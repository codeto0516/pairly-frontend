import urlJoin from "url-join";
import { ApiResponse, useApi } from "../../../../hooks/useApi";

interface GategoryApiResponse extends ApiResponse {
    data: {

    };
}

export const useCategory = () => {
    const api = useApi();

    const endPoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "categories");

    const getCategories = async (type: "spending" | "income"): Promise<any> => {
        const res = await api.get<GategoryApiResponse>({
            url: urlJoin(endPoint, type),
            cache: "force-cache",
        });

        console.log(res);
        

        return res;
    };

    return { getCategories };
};
