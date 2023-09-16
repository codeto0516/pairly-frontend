"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

import { Transaction } from "../../types/transaction";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { countSelector, monthSelector, pageSelector, perPageSelector, totalSelector, yearSelector } from "../../stores/transactionListParams";

import { useTransaction } from "../../api/useTransaction";
import { TransactionGroupByDate, groupByDate } from "../../../../../lib/groupByDate";
import { TransactionListItem } from "./ListItem";
import { transactionListState } from "../../stores/transactionList";
/* -----------------------------------------------------------------------
 リスト
----------------------------------------------------------------------- */

export const TransactionList = () => {
    const { getTransactionList } = useTransaction();

    const page = useRecoilValue<number>(pageSelector);
    const perPage = useRecoilValue<number>(perPageSelector);
    const [total, setTotal] = useRecoilState<number>(totalSelector);
    const year = useRecoilValue<number>(yearSelector);
    const month = useRecoilValue<number>(monthSelector);

    const setCount = useSetRecoilState(countSelector);

    const [transactionGroupByDate, setTransactionGroupByDate] = useState<any | undefined>(undefined);
    const [transactionList, setTransactionList] = useRecoilState<any | null>(transactionListState);

    useEffect(() => {
        (async () => {
            // 取引リストを取得
            const res = await getTransactionList({
                // 現在の年を取得
                year: year,
                month: month,
            });

            // もし取引リストがなければ終了
            if (!res?.ok) return;

            // 取引リスト（未加工）をセット
            setTransactionList(() => res.data.transactions);

            // 取引リストの総数をセット
            setTotal(res.data.totalCount);
        })();
    }, [year, month]);

    useEffect(() => {
        // 上の処理よりも前に実行されたら終了
        if (total === null) return;

        // ページネーションの数を計算してセット
        setCount(Math.ceil(transactionList.length / perPage));

        // 取引リストの総数をセット
        setTotal(transactionList.length);

        if (transactionList.length === 0) {
            // 取引がなければnullをセット => 「取引がありません」と表示
            setTransactionGroupByDate(() => null);
        } else {
            // 取引があれば日付ごとにグループ化してセット
            const groupByDateList = groupByDate(transactionList, perPage);
            setTransactionGroupByDate(() => groupByDateList);
        }
    }, [transactionList, perPage]);

    // 取引リストを取得中はスケルトンを表示
    if (transactionGroupByDate === undefined) {
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

    // 取引がなければ「取引がありません」と表示
    if (transactionGroupByDate === null) {
        return (
            <div className="w-full h-80 flex justify-center items-center">
                <p className="text-center text-gray-500">取引がありません</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full text-gray-500">
            {/* 取得したデータをmapで1つずつ取り出す */}
            {transactionGroupByDate[page - 1].map((transactionList: TransactionGroupByDate, index: number) => (
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
