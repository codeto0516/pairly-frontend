// 支出か収入かを選ぶボタン

import { useTransactionContext } from "@/src/components/elements/transaction/TransactionForm";
import { ToggleButton } from "../button/ToggleButton";

const toggleList = [
    { title: "支出", value: "spending" },
    { title: "収入", value: "income" },
];

export const TypeToggleButton = () => {
    const { transaction, changeTransaction } = useTransactionContext();

    const handleChange = (event: React.MouseEvent<HTMLElement>, newType: "spending" | "income") => {
        if (newType) {
            changeTransaction("type", newType);
        }
    };

    return <ToggleButton toggleList={toggleList} handler={handleChange} value={transaction.type} />;
};
