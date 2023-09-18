// Material UI
import {
    Restaurant as RestaurantIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { IconButton, Collapse, Modal } from "@mui/material";

// 型定義
import { useToggle } from "@/src/hooks/useToggle";
import { motion } from "framer-motion";
import { Transaction } from "../../types/transaction";
import { TransactionForm } from "../TransactionForm/main";
import { useUser } from "@/src/hooks/useUser";
import { UserIcon } from "@/src/components/dataDisplay/UsersIcon";
import { useEffect, useState } from "react";
import { User } from "@/src/types/user";
import { FloatingButton } from "@/src/components/inputs/button/FloatingButton";
import { CloseButton } from "@/src/components/inputs/button/IconButton";
export const TransactionListItem = (props: { transaction: Transaction }) => {
    // アコーディオンの開閉状態管理用
    const [isAccordion, toggleAccordion] = useToggle(false);
    const [isModal, toggleModal] = useToggle(false);

    const [user, setUser] = useState<User | null>(null);
    const { getUser } = useUser();

    useEffect(() => {
        (async () => {
            const user: any = await getUser(props.transaction.createdBy);
            setUser(() => user);
        })();
    }, []);

    return (
        <motion.div
            key={props.transaction.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="border border-gray-300 rounded-md hover:cursor-pointer hover:bg-gray-100 "
        >
            {/* -----------------------------------------------------------------------
             最初に表示される個別のリストアイテム。下のアコーディオンを開けば詳細が見れる
            ----------------------------------------------------------------------- */}
            <li
                className="flex flex-row gap-4 items-center justify-between p-4 text-black text-sm"
                onClick={() => toggleModal(true)}
            >
                {/* 支出 or 収入 */}
                {props.transaction.type === "spending" ? (
                    // <ArrowOutwardIcon className="text-white bg-red-500 rounded-full p-1" />
                    <div className="bg-red-200 text-white px-2 py-1 rounded-sm text-xs font-bold">支出</div>
                ) : (
                    // <SouthWestIcon className="text-white bg-blue-500 rounded-full p-1" />
                    <div className="bg-blue-200 text-white px-2 py-1 rounded-sm text-xs font-bold">収入</div>
                )}

                {/* 投稿者 */}
                <UserIcon label={user?.displayName ?? user?.email} image={user?.photoUrl} size={25} />

                {/* 内容 */}
                <p className="flex-grow truncate">{props.transaction.content}</p>

                {/* 金額 */}
                <p className="whitespace-nowrap">
                    <span>¥ {props.transaction.type === "spending" && "-"}</span>
                    {props.transaction.amounts.reduce((sum: any, entry: any) => sum + entry.amount, 0)}
                </p>
            </li>
            {isModal && (
                <Modal
                    open={isModal}
                    onClose={() => toggleModal(false)}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        "&:focus": {
                            outline: "none", // フォーカス時にアウトラインを削除
                        },
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1}}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-[350px] rounded-md overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0">
                            <CloseButton onClick={() => toggleModal(false)} />
                        </div>
                        <TransactionForm transaction={props.transaction} toggleModal={toggleModal} />
                    </motion.div>
                </Modal>
            )}
        </motion.div>
    );
};
