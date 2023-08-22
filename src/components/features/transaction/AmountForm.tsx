import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import { UserIcon } from "../../elements/icon/UsersIcon";
import { useTransactionContext } from "@/src/components/features/transaction/TransactionForm";
import { useEffect, useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";



export const AmountForm = () => {
    const { transaction, changeTransaction } = useTransactionContext();

    const [user1Amount, setUser1Amount] = useState<number>(transaction.description[0].amount);
    const [user2Amount, setUser2Amount] = useState<number>(transaction.description[1].amount);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const changeUser1Amount = (newAmount: number) => {
        changeTransaction("description[0].amount", newAmount);
        setUser1Amount(newAmount);
    };

    const changeUser2Amount = (newAmount: number) => {
        changeTransaction("description[1].amount", newAmount);
        setUser2Amount(newAmount);
    };

    const changeTotalAmount = (newTotalAmount: number) => setTotalAmount(() => newTotalAmount);

    useEffect(() => {
        const total = user1Amount + user2Amount;
        if (total > 0) {
            changeTotalAmount(total);
        } else {
            changeTotalAmount(0);
        }
    }, [user1Amount, user2Amount]);

    return (
        <div className="flex flex-col gap-2">
            <CustomAmountForm
                userName={transaction.description[0].user}
                userAmount={user1Amount}
                handler={changeUser1Amount}
            />
            <CustomAmountForm
                userName={transaction.description[1].user}
                userAmount={user2Amount}
                handler={changeUser2Amount}
            />
            <p className="text-gray-500">
                合計: ¥ {totalAmount} <span className="text-xs">(税込)</span>
            </p>
        </div>
    );
};


const CustomAmountForm = (props: { userName: string; userAmount: number; handler: any }) => {
    const { currentUser } = useAuth();

    return (
        <div className="flex items-end gap-4 ">
            {/* ユーザーアイコン */}
            <UserIcon user={currentUser} />
            {/* 入力フォーム */}
            <TextField
                label={`${props.userName} の支払い額を入力`}
                variant="standard"
                className="w-full"
                type="number"
                value={props.userAmount <= 0 ? "" : props.userAmount}
                onChange={(e) => props.handler(Number(e.target.value))}
                InputProps={{
                    inputProps: {
                        inputMode: "numeric",
                        pattern: "[0-9]*", // 数値以外の文字を削除
                    },
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                }}
            />
        </div>
    );
};