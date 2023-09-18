import { useToggle } from "@/src/hooks/useToggle";
import { motion } from "framer-motion";
import { Transaction } from "../../types/transaction";
import { TransactionFormModal } from "../TransactionForm/main";
import { useUser } from "@/src/hooks/useUser";
import { UserIcon } from "@/src/components/dataDisplay/UsersIcon";
import { useEffect, useState } from "react";
import { User } from "@/src/types/user";

export const TransactionListItem = (props: { transaction: Transaction }) => {
    // モーダルの表示・非表示
    const [isModal, toggleModal] = useToggle(false);

    // 投稿者のアイコン
    const { getUser } = useUser();
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        (async () => {
            const user: any = await getUser(props.transaction.createdBy);
            setUser(() => user);
        })();
    }, []);

    return (
        <>
            <motion.li
                key={props.transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-row gap-4 items-center justify-between p-4 text-black text-sm  border border-gray-300 rounded-md hover:cursor-pointer hover:bg-gray-100"
                onClick={() => toggleModal(true)}
            >
                {/* 支出 or 収入 */}
                {props.transaction.type === "spending" ? (
                    <div className="bg-red-200 text-white px-2 py-1 rounded-sm text-xs font-bold">支出</div>
                ) : (
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
            </motion.li>

            {/* クリックしたら詳細をモーダル表示 */}
            <TransactionFormModal transaction={props.transaction} isModal={isModal} toggleModal={toggleModal} />
        </>
    );
};
