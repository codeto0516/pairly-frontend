"use client";

// デモデータ

import { createContext, useEffect, useState } from "react";

// Material UI
import {
    Restaurant as RestaurantIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { IconButton, Collapse, Skeleton } from "@mui/material";

// 型定義
import { TransactionForm } from "./TransactionForm/TransactionForm";
import { TransactionListType, TransactionType } from "@/src/types/transaction";

import { useToggle } from "@/src/hooks/useToggle";
import { useTransaction } from "@/src/hooks/api/v1/useTransaction";
import { groupByDate } from "@/src/hooks/groupByDate";
import { SetRecoilState, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { transactionState } from "@/src/recoil/transaction";
import { motion } from "framer-motion";
import {
    TransactionListParams,
    countSelector,
    isButtonClickSelector,
    pageSelector,
    perPageSelector,
    transactionListParamsState,
} from "@/src/recoil/transactionListParams";
/* -----------------------------------------------------------------------
 リスト
----------------------------------------------------------------------- */
interface TransactionListProps {
    pagenation: any;
    changePagenation: any;
}

export const TransactionList = () => {
    const { getTransactionList } = useTransaction();
    const [transactionList, setTransactionList] = useState<any>();

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

            if (!res) return;

            setCount(Math.ceil(res.data.total_count / perPage));

            const groupByDateList: any = groupByDate(res.data.transactions);

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

    console.log(transactionList);
    
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
                        {transactionList.transactions.map((transaction: TransactionType) => (
                            <TransactionItem key={transaction.id} transaction={transaction} />
                            // ↓下のリストアイテムを表示
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

/* -----------------------------------------------------------------------
 アイテム
----------------------------------------------------------------------- */
const TransactionItem = ({ transaction }: { transaction: TransactionType }) => {
    // アコーディオンの開閉状態管理用
    const [isAccordion, toggleAccordion] = useToggle(false);

    return (
        <motion.div
            key={transaction.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0}}
            transition={{ duration: 0.5 }}
            className="border border-gray-300 rounded-md overflow-hidden"
        >
            {/* -----------------------------------------------------------------------
             最初に表示される個別のリストアイテム。下のアコーディオンを開けば詳細が見れる
            ----------------------------------------------------------------------- */}
            <li
                className="flex flex-row gap-4 items-center justify-between px-4 py-3 text-black text-sm"
                onClick={() => toggleAccordion()}
            >
                {/* カテゴリーアイコン */}
                <RestaurantIcon className="text-white bg-red-500 rounded-full p-1" />

                {/* 内容 */}
                <p className="flex-grow truncate">{transaction.content}</p>

                {/* 金額 */}
                <p className="whitespace-nowrap">
                    ¥ -{transaction.amounts.reduce((sum: any, entry: any) => sum + entry.amount, 0)}
                </p>

                {/* 開閉ボタン */}
                <IconButton size="small">
                    {isAccordion ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </li>

            {/* -----------------------------------------------------------------------
             詳細（アコーディオンで表示）
            ----------------------------------------------------------------------- */}
            <li>
                <Collapse in={isAccordion} timeout="auto" unmountOnExit>
                    <TransactionForm transaction={transaction} />
                </Collapse>
            </li>
        </motion.div>
    );
};
