// Material UI
import {
    Restaurant as RestaurantIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { IconButton, Collapse } from "@mui/material";

// 型定義
import { useToggle } from "@/src/hooks/useToggle";
import { motion } from "framer-motion";
import { TransactionType } from "../../types";
import { TransactionForm } from "../TransactionForm/main";

export const TransactionListItem = (props: { transaction: TransactionType }) => {
    // アコーディオンの開閉状態管理用
    const [isAccordion, toggleAccordion] = useToggle(false);

    return (
        <motion.div
            key={props.transaction.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
                <p className="flex-grow truncate">{props.transaction.content}</p>

                {/* 金額 */}
                <p className="whitespace-nowrap">
                    ¥ -{props.transaction.amounts.reduce((sum: any, entry: any) => sum + entry.amount, 0)}
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
                    <TransactionForm transaction={props.transaction} />
                </Collapse>
            </li>
        </motion.div>
    );
};
