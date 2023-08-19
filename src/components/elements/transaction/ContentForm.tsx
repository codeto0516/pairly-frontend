import { useTransactionContext } from "@/src/components/elements/transaction/TransactionForm";
import { TextField } from "@mui/material";

export const ContentForm = () => {
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
