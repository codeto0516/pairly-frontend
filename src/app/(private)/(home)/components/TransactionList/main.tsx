"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

import { Transaction } from "../../types/transaction";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { countSelector, pageSelector, perPageSelector, totalSelector } from "../../stores/transactionListParams";

import { useTransaction } from "../../api/useTransaction";
import { TransactionGroupByDate, groupByDate } from "../../../../../lib/groupByDate";
import { TransactionListItem } from "./ListItem";
import { transactionListState } from "../../stores/transactionList";
/* -----------------------------------------------------------------------
 リスト
----------------------------------------------------------------------- */

export const TransactionList = () => {
    const { getTransactionList, getTransactionsForSpecificMonth } = useTransaction();
    // const [transactionList, setTransactionList] = useState<TransactionGroupByDate[]>();

    const page = useRecoilValue<number>(pageSelector);
    const perPage = useRecoilValue<number>(perPageSelector);
    const [total, setTotal] = useRecoilState<number>(totalSelector);

    const setCount = useSetRecoilState(countSelector);

    const [transactionGroupByDate, setTransactionGroupByDate] = useState<any | undefined>(undefined);
    const [transactionList, setTransactionList] = useRecoilState<any>(transactionListState);

    useEffect(() => {
        (async () => {
            // 取引リストを取得
            const res = await getTransactionsForSpecificMonth({
                year: 2023,
                month: 9,
            });

            if (!res?.data) return;

            setTransactionList(() => res.data.transactions);
        })();
    }, []);

    useEffect(() => {
        if (transactionList) {
            setTotal(transactionList.length);
            setCount(Math.ceil(transactionList.length / perPage));

            const groupByDateList = groupByDate(transactionList, perPage);
            setTransactionGroupByDate(() => groupByDateList);
        }
    }, [transactionList, perPage]);

    if (transactionList === undefined) {
        return (
            <div className="flex flex-col gap-1 w-full">
                {[...Array(perPage)].map((_, index: number) => {
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

    if (transactionGroupByDate === undefined) {
        return (
            <div className="flex justify-center">
                <p>取得中...</p>
            </div>
        );
    }

    if (transactionGroupByDate.length === 0) {
        return (
            <div className="flex justify-center">
                <p>取引はありません</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full text-gray-500">
            {/* 取得したデータをmapで1つずつ取り出す */}
            {transactionGroupByDate[page - 1].map((transactionList: any, index: number) => (
                // 日付ごとに取引を分けて表示する
                <div key={index} className="rounded-sm overflow-hidden">
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
