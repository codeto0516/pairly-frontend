import urlJoin from "url-join";
import { ApiResponse, useApi } from "../../../../hooks/useApi";
import { BigCategory, CategoryType } from "../components/TransactionForm/Category";

interface GetCategoriesResponse extends ApiResponse {
    data: {
        categories: BigCategory[];
    };
}

interface GetCategoryAllResponse extends ApiResponse {
    data: {
        types: CategoryType[];
    };
}

export const useCategory = () => {
    const api = useApi();

    const endPoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "categories");

    const getCategoryAll = async () => {
        const res = await api.get<GetCategoryAllResponse>({
            url: endPoint,
            cache: "force-cache",
        });

        return res;
    };

    const getCategories = async (type: "spending" | "income") => {
        const res = await api.get<GetCategoriesResponse>({
            url: urlJoin(endPoint, type),
            cache: "force-cache",
        });

        return res;
    };

    return { getCategoryAll, getCategories };
};
