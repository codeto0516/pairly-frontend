import { TransactionType } from "@/src/types/transaction.d";
import { useApi } from "./useApi";

export const useTransaction = () => {
    const api = useApi();

    const endPoint = "http://192.168.1.10:80/api/v1/transactions";

    const getTransactionList = async ({ page, perPage }: { page: number; perPage: number }) => {
        // page: 何ページ目か  perPage: 表示数
        const res: any = await api.get({
            url: `${endPoint}?page=${page}&per-page=${perPage}`,
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
