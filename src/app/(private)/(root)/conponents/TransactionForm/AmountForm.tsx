import TextField from "@mui/material/TextField";
import { InputAdornment, Skeleton } from "@mui/material";
import { UserIcon } from "../../../../../components/elements/icon/UsersIcon";
import { useTransactionContext } from "@/src/app/(private)/(root)/conponents/TransactionForm/TransactionForm";
import { useEffect, useState } from "react";
import { useUser } from "@/src/hooks/api/v1/useUser";
import { Amount, TransactionType } from "@/src/types/transaction";

export const AmountForm = () => {
    const { transaction, setTransaction } = useTransactionContext();

    const changeAmount = (userId: number, amount: number) => {
        setTransaction((prevTransaction: TransactionType) => ({
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

const BaseAmountForm = ({ item, changeAmount }: { item: any; changeAmount: any }) => {
    const [user, setUser] = useState<any>(null);
    const { getUser } = useUser();

    useEffect(() => {
        (async () => {
            const res: any = await getUser(item.user_id);
            setUser(() => res.user);
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
        <div key={item.user_id} className="flex items-end gap-4">
            {/* ユーザーアイコン */}
            <UserIcon user={user} />
            {/* 入力フォーム */}
            <TextField
                label={`${user.name} の支払い額を入力`}
                variant="standard"
                className="w-full"
                type="number"
                value={item.amount <= 0 ? null : item.amount}
                onChange={(e) => changeAmount(item.user_id, Number(e.target.value))}
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
