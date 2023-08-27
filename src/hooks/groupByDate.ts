import { TransactionType } from "@/src/types/transaction";

interface GroupByDateType {
    date: string;
    transactions: TransactionType[];
}

// 日付ごとに取引データをグループ化する関数
export const groupByDate = (transactionList: TransactionType[]) => {
    const groupedData: GroupByDateType[] = [];
    const dateMap = new Map();

    console.log(transactionList);
    
    if(!transactionList) return groupedData;

    transactionList.forEach((transaction) => {
        const date = transaction.paid_date;
        if (!dateMap.has(date)) {
            dateMap.set(date, []);
        }
        dateMap.get(date).push(transaction);
    });

    dateMap.forEach((transactions, date) => {
        groupedData.push({ date, transactions });
    });

    return groupedData;
};

