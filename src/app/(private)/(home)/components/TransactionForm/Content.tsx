import { TextField } from "@mui/material";
import { useTransactionContext } from "./TransactionForm";

export const TransactionFormContent = () => {
    const { transaction, changeTransaction } = useTransactionContext();
    return (
        <TextField
            label="内容"
            variant="standard"
            multiline
            value={transaction.content}
            onChange={(e) => changeTransaction("content", e.target.value)}
        />
    );
};
