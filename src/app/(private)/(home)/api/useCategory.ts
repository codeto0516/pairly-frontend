import urlJoin from "url-join";
import { ApiResponse, useApi } from "../../../../hooks/useApi";
import { BigCategory } from "../components/TransactionForm/Category";

interface GategoryApiResponse extends ApiResponse {
    data: {
        categories: BigCategory[];
    };
}

export const useCategory = () => {
    const api = useApi();

    const endPoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "categories");

    const getCategories = async (type: "spending" | "income") => {
        const res = await api.get<GategoryApiResponse>({
            url: urlJoin(endPoint, type),
            cache: "force-cache",
        });
        console.log(res);

        return res;
    };

    return { getCategories };
};
