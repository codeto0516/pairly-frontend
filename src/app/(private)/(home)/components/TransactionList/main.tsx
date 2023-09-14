"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

import { Transaction } from "../../types/transaction";

import { useRecoilValue, useSetRecoilState } from "recoil";
import {
    countSelector,
    isButtonClickSelector,
    pageSelector,
    perPageSelector,
} from "../../stores/transactionListParams";

import { useTransaction } from "../../api/useTransaction";
import { TransactionGroupByDate, groupByDate } from "../../../../../lib/groupByDate";
import { TransactionListItem } from "./ListItem";
/* -----------------------------------------------------------------------
 リスト
----------------------------------------------------------------------- */

export const TransactionList = () => {
    const { getTransactionList } = useTransaction();
    const [transactionList, setTransactionList] = useState<TransactionGroupByDate[]>();

    const page = useRecoilValue<number>(pageSelector);
    const perPage = useRecoilValue<number>(perPageSelector);
    const isClickButton = useRecoilValue<boolean>(isButtonClickSelector);
    const setCount = useSetRecoilState(countSelector);

    useEffect(() => {
        (async () => {
            // 取引リストを取得
            const res = await getTransactionList({
                page: page,
                perPage: perPage,
            });

            if (!res?.data) {
                setTransactionList(() => undefined);
                return;
            }

            setCount(Math.ceil(res.data.total_count / perPage));

            const groupByDateList = groupByDate(res.data.transactions);

            setTransactionList(() => groupByDateList);
        })();
    }, [page, perPage, isClickButton]);

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

    if (transactionList.length === 0) {
        return (
            <div className="flex justify-center">
                <p>取引はありません</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full text-gray-500">
            {/* 取得したデータをmapで1つずつ取り出す */}
            {transactionList.map((transactionList: any, index: number) => (
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
