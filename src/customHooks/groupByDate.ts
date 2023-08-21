import { TransactionType } from "@/src/types/transaction";
import testdata from "../datas/testdata2";

interface GroupByDateType {
    date: string;
    transactions: TransactionType[];
}

// 日付ごとに取引データをグループ化する関数
const groupByDate = (transactionList: TransactionType[]) => {
    const groupedData: GroupByDateType[] = [];
    const dateMap = new Map();

    transactionList.forEach((transaction) => {
        const date = transaction.date;
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

groupByDate(testdata);
