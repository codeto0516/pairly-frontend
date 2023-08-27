"use client";

// デモデータ
import testdata from "@/src/datas/testdata";

import { createContext, useEffect, useState } from "react";

// Material UI
import {
    Restaurant as RestaurantIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { IconButton, Collapse } from "@mui/material";

// 型定義
import { TransactionForm } from "./TransactionForm";
import { TransactionListType, TransactionType } from "@/src/types/transaction";

import { useToggle } from "@/src/hooks/useToggle";
import { useTransaction } from "@/src/hooks/api/useTransaction";
import { groupByDate } from "@/src/hooks/groupByDate";

/* -----------------------------------------------------------------------
 リスト
----------------------------------------------------------------------- */
export const TransactionList = () => {
    const { getTransactionList } = useTransaction();
    const [transactionList, setTransactionList] = useState<any>();


    useEffect(() => {
        (async () => {
            const res = await getTransactionList(1, 10);

            const groupByDateList: any = groupByDate(res.data);

            setTransactionList(() => groupByDateList);
        })();
    }, []);


    if (transactionList === undefined) {
        return "...loading";
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
                            <TransactionItem key={transaction.id} {...transaction} />
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
export const TransactionContext = createContext<TransactionType | undefined>(undefined);

const TransactionItem = (transaction: TransactionType) => {
    // アコーディオンの開閉状態管理用
    const [isAccordion, toggleAccordion] = useToggle(false);

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden">
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
        </div>
    );
};
