import TextField from "@mui/material/TextField";
import { InputAdornment, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { Amount, Transaction } from "../../types/transaction";
import { UserIcon } from "@/src/components/dataDisplay/UsersIcon";
import { useTransactionContext } from "./main";
import { useUser } from "@/src/hooks/useUser";
import { User } from "@/src/types/user";

export const TransactionFormAmount = () => {
    const { transaction, setTransaction } = useTransactionContext();

    const changeAmount = (userId: number, amount: number) => {
        setTransaction((prevTransaction: Transaction) => ({
            ...prevTransaction,
            amounts: prevTransaction.amounts.map((item: any) =>
                item.user_id === userId ? { ...item, amount: amount } : item
            ),
        }));
    };

    return (
        <div className="flex flex-col gap-2">
            {transaction.amounts.map((item: Amount) => {
                return <BaseAmountForm key={item.user_id} item={item} changeAmount={changeAmount} />;
            })}

            <p className="text-gray-500">
                合計: ¥ {transaction.amounts.reduce((sum: any, entry: any) => sum + entry.amount, 0)}
                <span className="text-xs"> (税込)</span>
            </p>
        </div>
    );
};

const BaseAmountForm = (props: { item: any; changeAmount: any }) => {
    const [user, setUser] = useState<User | null>(null);
    const { getUser } = useUser();

    useEffect(() => {
        (async () => {
            const user: any = await getUser(props.item.user_id);
            setUser(() => user);
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (user == null) {
        return (
            <div className="flex flex-row gap-4 items-baseline">
                <Skeleton variant="circular" animation="wave" style={{ minWidth: "32px", minHeight: "32px" }} />
                <Skeleton variant="rectangular" animation="wave" width="100%" height={48} />
            </div>
        );
    }

    return (
        <div key={props.item.user_id} className="flex items-end gap-4">
            {/* ユーザーアイコン */}
            <UserIcon label={user.displayName ?? user.email} image={user.photoUrl} />
            {/* 入力フォーム */}
            <TextField
                label={`${user.displayName ?? user.email} の支払い額を入力`}
                variant="standard"
                className="w-full"
                type="number"
                value={props.item.amount <= 0 ? null : props.item.amount}
                onChange={(e) => props.changeAmount(props.item.user_id, Number(e.target.value))}
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
