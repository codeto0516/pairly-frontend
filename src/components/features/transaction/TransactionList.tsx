"use client";

// デモデータ
import testdata from "@/src/datas/testdata";

import { createContext } from "react";

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


/* -----------------------------------------------------------------------
 リスト
----------------------------------------------------------------------- */
export const TransactionList = () => {
    const transactionList = testdata;

    return (
        <div className="flex flex-col gap-4 w-full text-gray-500">
            {/* 取得したデータをmapで1つずつ取り出す */}
            {transactionList.map((transactionList: TransactionListType, index: number) => (
                // 日付ごとに取引を分けて表示する
                <div key={index} className="rounded-sm overflow-hidden">
                    {/* 日付 */}
                    <time className="bg-whte font-bold text-gray-500 mb-1 text-xs md:text-sm px-2 py-0.5 md:py-1 ">
                        {transactionList.date}
                    </time>

                    {/* その日付の全ての記録一覧を表示 */}
                    <ul className="flex flex-col gap-0.5">
                        {transactionList.transactions.map((transaction: TransactionType, transIndex: number) => (
                            <TransactionItem key={transIndex} {...transaction} />
                            // ↓下のリストアイテムを表示
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

/* -----------------------------------------------------------------------
 リストアイテム
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
                <p className="whitespace-nowrap">¥ -{transaction.total_amount}</p>

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
