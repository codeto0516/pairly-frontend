import { useApi } from "../../../../hooks/useApi";
import urlJoin from "url-join";

export const useTransaction = () => {
    const api = useApi();

    const endPoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "transactions");

    const getTransactionList = async ({ page, perPage }: { page: number; perPage: number }) => {
        // page: 何ページ目か  perPage: 表示数
        const res: any = await api.get({
            // url: `${endPoint}?page=${page}&per-page=${perPage}`,
            url: urlJoin(endPoint, `?page=${page}`, `?per-page=${perPage}`),
        });

        return res;
    };

    const sendTransaction = async (transaction: any) => {
        const res: any = await api.post({
            url: endPoint,
            data: transaction,
        });

        return res;
    };

    const updateTransaction = async (transaction: any) => {
        const res: any = await api.put({
            url: `${endPoint}/${transaction.id}`,
            data: transaction,
        });

        return res;
    };

    const delteTransaction = async (transaction_id: number) => {
        const res: any = await api.del({
            url: `${endPoint}/${transaction_id}`,
        });

        return res;
    };

    return { getTransactionList, sendTransaction, updateTransaction, delteTransaction };
};
