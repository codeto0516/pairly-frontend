import { atom, useSetRecoilState, selector } from "recoil";

// 

export const transactionListState = atom<any>({
    key: "transactionListState",
    default: [],
});

export const transactionListSelector = selector({
    key: "userSelector", // 一意のキー
    get: ({ get }) => {
        const transactionList = get(transactionListState);
        return transactionList;
    },
    set: ({ set }, newTransactionList) => {
        set(transactionListState, newTransactionList);
    },
});


export const deleteTransaction = (idToDelete: number) => {
    return () => {
        const setTransactionList = useSetRecoilState(transactionListState);

        setTransactionList((oldTransactionList: any) =>
            oldTransactionList.filter((transaction:any) => transaction.id !== idToDelete)
        );
    };
};