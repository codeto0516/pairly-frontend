// 支出か収入かを選ぶボタン

import { useTransactionContext } from "@/src/components/features/transaction/TransactionForm";
import { ToggleButton } from "../../elements/button/ToggleButton";

const toggleList = [
    { title: "支出", value: "支出" },
    { title: "収入", value: "収入" },
];

export const TypeToggleButton = () => {
    const { transaction, changeTransaction } = useTransactionContext();

    const handleChange = (event: React.MouseEvent<HTMLElement>, newType: "支出" | "収入") => {
        if (newType) {
            changeTransaction("type", newType);
        }
    };

    return <ToggleButton toggleList={toggleList} handler={handleChange} value={transaction.type} />;
};
