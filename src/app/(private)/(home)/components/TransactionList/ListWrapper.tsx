"use client";

import { useRecoilState } from "recoil";
import { useTransaction } from "../../api/useTransaction";
import { transactionListState } from "../../stores/transactionList";
import { ChangeEvent, useEffect, useState } from "react";
import { TransactionGroupByDate, groupByDate } from "@/src/lib/groupByDate";
import { SearchBox } from "../Filters/KeywordSearchBox";
import { YearSelector } from "../Filters/YearSelector";
import { MonthSelector } from "../Filters/MonthSelector";
import { PerPageSelector } from "../Filters/PerPageSelector";
import { TransactionList } from "./List";
import { Pagination } from "@mui/material";


export const TransactionListWrapper = () => {
    const { getTransactionList } = useTransaction();

    const [transactionList, setTransactionList] = useRecoilState(transactionListState);

    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);

    const [total, setTotal] = useState<number | null>(null);
    const [count, setCount] = useState<number>(0); // ページネーションのボタン数＝ ページ数 / ページあたりの件数 の切り上げ

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

    const [transactionGroupByDate, setTransactionGroupByDate] = useState<TransactionGroupByDate[] | null | undefined>(
        undefined
    );

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
            setTotal(() => res.data.totalCount);
        })();
    }, [year, month]);

    useEffect(() => {
        // 上の処理よりも前に実行されたら終了
        if (total === null) return;

        // ページネーションの数を計算してセット
        setCount(Math.ceil(transactionList.length / perPage));

        // 取引リストの総数をセット
        setTotal(() => transactionList.length);
        
        if (transactionList.length === 0) {
            // 取引がなければnullをセット => 「取引がありません」と表示
            setTransactionGroupByDate(() => null);
        } else {
            // 取引があれば日付ごとにグループ化してセット
            const groupByDateList = groupByDate(transactionList, perPage);
            setTransactionGroupByDate(() => groupByDateList);

            setTransactionGroupByDate(() => groupByDateList[page - 1]);
        }
    }, [transactionList, perPage, page]);

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* 検索ボックス */}
            {/* <SearchBox /> */}

            {/* 表示件数を選択するボタン */}
            <div className="flex justify-between w-full gap-2 ju">
                {/* 表示する月を選択 */}
                <div className="flex gap-2">
                    <YearSelector year={year} setYear={setYear} />
                    <MonthSelector month={month} setMonth={setMonth} />
                </div>

                {/* 表示件数 */}
                <PerPageSelector total={total} perPage={perPage} setPerPage={setPerPage} />
            </div>

            {/* 取引記録一覧を表示 */}
            <TransactionList transactionGroupByDate={transactionGroupByDate} />

            {/* ページネーション */}
            {total !== null && total >= 1 && (
                <Pagination
                    page={page}
                    count={count}
                    onChange={(e: ChangeEvent<unknown>, page: number) => setPage(page)}
                    shape="rounded"
                    className="flex justify-center mt-8"
                />
            )}
        </div>
    );
};
