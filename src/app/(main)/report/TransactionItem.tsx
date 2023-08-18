"use client";

import { useState, createContext } from "react";

// Material UI
import {
    Restaurant as RestaurantIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { IconButton, Collapse, Modal } from "@mui/material";

// 型定義
import { TransactionListType, TransactionType } from "@/src/types/transaction";
import { TransactionForm } from "./TransactionForm";

/* -----------------------------------------------------------------------
 本体
----------------------------------------------------------------------- */
export const TransactionContext = createContext<TransactionType | undefined>(undefined);

export const TransactionItem = (transaction: TransactionType) => {
    // アコーディオンの開閉状態管理用
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const openModal = () => setIsModalOpen(true);
    // const closeModal = () => setIsModalOpen(false);
    return (
        <div className="border border-gray-300 rounded-md overflow-hidden">
            {/* -----------------------------------------------------------------------
             リスト（最初に表示されるリスト。下のアコーディオンを開けば詳細が見れる）
            ----------------------------------------------------------------------- */}
            <li
                className="flex flex-row gap-4 items-center justify-between px-4 py-3 text-black text-sm"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            >
                {/* カテゴリーアイコン */}
                <RestaurantIcon className="text-white bg-red-500 rounded-full p-1" />

                {/* 内容 */}
                <p className="flex-grow truncate">{transaction.content}</p>

                {/* 金額 */}
                <p className="whitespace-nowrap">¥ -{transaction.total_amount}</p>

                {/* 開閉ボタン */}
                <IconButton size="small">
                    {isAccordionOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    {/* <ZoomOutMapIcon fontSize="small" /> */}
                    {/* <p className="text-xs bg-gray-400 text-white p-0.5 rounded-sm">詳細</p> */}
                </IconButton>
            </li>

            {/* -----------------------------------------------------------------------
             詳細（アコーディオンで表示）
            ----------------------------------------------------------------------- */}
            <li>
                <Collapse in={isAccordionOpen} timeout="auto" unmountOnExit>
                    <TransactionForm transaction={transaction} />
                </Collapse>
            </li>
            {/* <Modal open={isModalOpen} onClose={closeModal}>
                <div className="fixed inset-1/2 flex items-center justify-center bg-black bg-opacity-50 ">
                    <div className="">
                        <TransactionForm transaction={transaction} />
                    </div>
                </div>
            </Modal> */}
        </div>
    );
};
