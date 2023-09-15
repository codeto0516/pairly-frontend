import { Transaction } from "../app/(private)/(home)/types/transaction";

`
[
    // 1ページ目
    0: {
        [
            0: {
                date: "2021-01-01",
                transactions: [
                    0: {
                        id: 1,
                        ...
                    },
                ]
            },
            1: {
                date: "2021-01-02",
                transactions: [
                    ...
                ]
            },
        ]
    },

    // 2ページ目...
]
`;

export interface TransactionGroupByDate {
    date: string;
    transactions: Transaction[];
}

// 日付ごとに取引データをグループ化し、各グループ内の取引データをソートする関数
export const groupByDate = (transactionList: Transaction[], perPage: number = 10) => {
    // ①取引リストを日付（新）とid（大）でソート
    // ①ソートリストをperPageごとに配列に分割

    if (!transactionList) return;

    const copyTransactionList = [...transactionList];

    // 日付の新しい順 かつ idが大きい順に並び替え
    copyTransactionList.sort((a, b) => {
        const dateA = new Date(a.paidDate).getTime();
        const dateB = new Date(b.paidDate).getTime();

        if (dateA === dateB) {
            const idA = a.id!;
            const idB = b.id!;
            return idB - idA;
        }
        return dateB - dateA;
    });

    // ソートリストをperPageごとに配列に分割;
    const transactionListPerPage: Transaction[][] = [];
    for (let i = 0; i < copyTransactionList.length; i += perPage) {
        transactionListPerPage.push(copyTransactionList.slice(i, i + perPage));
    }

    const all: any = [];

    // 分割したグループごとに日付でグルーピング
    transactionListPerPage.forEach((transactionList) => {
        const groupedAndSortedData: TransactionGroupByDate[] = [];
        const dateMap = new Map();

        transactionList.forEach((transaction) => {
            // 日付を取得
            const date = transaction.paidDate;

            // もし日付グループがまだ存在しなければ、新しいグループ（配列）を作成
            !dateMap.has(date) && dateMap.set(date, []);

            // 日付グループに取引データを追加
            dateMap.get(date).push(transaction);
        });

        // 日付グループを配列に変換
        dateMap.forEach((transactions, date) => {
            groupedAndSortedData.push({ date, transactions });
        });

        all.push(groupedAndSortedData);
    });

    return all;
};
