"use client";

import { Skeleton } from "@mui/material";
import { Transaction } from "../../types/transaction";
import { TransactionGroupByDate, groupByDate } from "../../../../../lib/groupByDate";
import { TransactionListItem } from "./ListItem";

//////////////////////////////////////////////////////////////////////////////////////////
// リスト
//////////////////////////////////////////////////////////////////////////////////////////
interface TransactionListProps {
    transactionGroupByDate: TransactionGroupByDate[] | null | undefined;
}
export const TransactionList = (props: TransactionListProps) => {
    // undefined: 取得中, null: 取引なし, Transaction[]: 取得成功

    // 取引リストを取得中はスケルトンを表示
    if (props.transactionGroupByDate === undefined) {
        return (
            <div className="flex flex-col gap-1 w-full">
                {[...Array(10)].map((_, index: number) => {
                    return (
                        <Skeleton
                            key={index}
                            variant="rounded"
                            animation="wave"
                            height={60}
                            style={{ width: "100%" }}
                        />
                    );
                })}
            </div>
        );
    }

    // 取引がなければ「取引がありません」と表示
    if (props.transactionGroupByDate === null) {
        return (
            <div className="w-full h-80 flex justify-center items-center">
                <p className="text-center text-gray-500">取引がありません</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full text-gray-500">
            {/* 取得したデータをmapで1つずつ取り出す */}
            {props.transactionGroupByDate.map((transactionList: TransactionGroupByDate, index: number) => (
                // 日付ごとに取引を分けて表示する
                <div key={index} className="rounded-sm">
                    {/* 日付 */}
                    <time className="bg-whte font-bold text-gray-500 mb-1 text-xs md:text-sm px-2 py-0.5 md:py-1 ">
                        {transactionList.date}
                    </time>

                    {/* その日付の全ての記録一覧を表示 */}
                    <ul className="flex flex-col gap-0.5">
                        {transactionList.transactions.map((transaction: Transaction) => (
                            <TransactionListItem key={transaction.id} transaction={transaction} />
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
