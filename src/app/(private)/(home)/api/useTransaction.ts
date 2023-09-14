import { ApiResponse, useApi } from "../../../../hooks/useApi";
import urlJoin from "url-join";
import { Transaction } from "../types/transaction";

interface TransactionApiResponse extends ApiResponse {
    data: {
        total_count: number;
        transactions: Transaction[];
    };
}

export const useTransaction = () => {
    const api = useApi();

    const endPoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "transactions");

    const getTransactionList = async ({ page, perPage }: { page: number; perPage: number }) => {
        // page: 何ページ目を表示するか  perPage: 表示件数
        const res = await api.get<TransactionApiResponse>({
            url: urlJoin(endPoint, `?page=${page}`, `?per-page=${perPage}`),
        });
        console.log(res);

        return res as TransactionApiResponse;
    };

    const createTransaction = async (transaction: Transaction) => {
        if (transaction.id) return;
        const res: any = await api.post({
            url: endPoint,
            data: transaction,
        });

        return res;
    };

    const updateTransaction = async (transaction: Transaction) => {
        if (!transaction.id) return;
        const res: any = await api.put({
            url: urlJoin(endPoint, transaction.id.toString()),
            data: transaction,
        });

        return res;
    };

    const delteTransaction = async (transactionId: number) => {
        const res: any = await api.del({
            url: urlJoin(endPoint, transactionId.toString()),
        });

        return res;
    };

    return { getTransactionList, createTransaction, updateTransaction, delteTransaction };
};
