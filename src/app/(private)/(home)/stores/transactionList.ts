import { selector, useRecoilState } from "recoil";
import { atom } from "recoil";
import { Transaction } from "../types/transaction";

////////////////////////////////////////////////////////////////////////////////////////////////
// アトムとセレクター
////////////////////////////////////////////////////////////////////////////////////////////////
export const transactionListState = atom({
    key: "transactionListState",
    default: [], // 初期値は空のリスト
});

// 取引リストのセレクター
export const transactionListSelector = selector({
    key: "transactionListSelector",
    get: ({ get }) => {
        return get(transactionListState);
    },
});

////////////////////////////////////////////////////////////////////////////////////////////////
// NEW
////////////////////////////////////////////////////////////////////////////////////////////////
export const addTransaction = (newTransaction: Transaction) => {
    return (oldTransactionList: Transaction[]) => [...oldTransactionList, newTransaction];
};

////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE
////////////////////////////////////////////////////////////////////////////////////////////////
export const updateTransaction = (updatedTransaction: Transaction) => {
    return (oldTransactionList: Transaction[]) => {
        const index = oldTransactionList.findIndex((transaction) => transaction.id === updatedTransaction.id);

        if (index !== -1) {
            const updatedList = [...oldTransactionList];
            updatedList[index] = updatedTransaction;
            return updatedList;
        }
        return [...oldTransactionList];
    };
};

////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE
////////////////////////////////////////////////////////////////////////////////////////////////
export const deleteTransaction = (transactionId: number) => {
    return (oldTransactionList: Transaction[]) => {
        return oldTransactionList.filter((transaction) => transaction.id !== transactionId);
    };
};
