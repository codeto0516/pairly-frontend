import { Transaction } from "../app/(private)/(home)/types/transaction";

export interface TransactionGroupByDate {
    date: string;
    transactions: Transaction[];
}

// 日付ごとに取引データをグループ化し、各グループ内の取引データをソートする関数
export const groupByDate = (transactionList: Transaction[]) => {
    const groupedAndSortedData: TransactionGroupByDate[] = [];
    const dateMap = new Map();

    if (!transactionList) return groupedAndSortedData;

    transactionList.forEach((transaction) => {
        const date = transaction.paid_date;
        if (!dateMap.has(date)) {
            dateMap.set(date, []);
        }
        dateMap.get(date).push(transaction);
    });

    // グループ化したデータをソートして新しい配列に格納
    dateMap.forEach((transactions, date) => {
        groupedAndSortedData.push({ date, transactions });
    });

    // 日付の新しい順に並び替え
    groupedAndSortedData.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // 新しい日付が先にくるようにソート
    });

    return groupedAndSortedData;
};
