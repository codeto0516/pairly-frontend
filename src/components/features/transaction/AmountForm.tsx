import TextField from "@mui/material/TextField";
import { InputAdornment, Skeleton } from "@mui/material";
import { UserIcon } from "../../elements/icon/UsersIcon";
import { useTransactionContext } from "@/src/components/features/transaction/TransactionForm";
import { useUserData } from "@/src/providers/SessionProvider";
import { useEffect, useState } from "react";
import { useUser } from "@/src/hooks/api/useUser";

export const AmountForm = () => {
    const { transaction, setTransaction } = useTransactionContext();

    const changeAmount = (userId: any, value: any) => {
        setTransaction((prevTransaction: any) => ({
            ...prevTransaction,
            amounts: prevTransaction.amounts.map((item: any) =>
                item.user_id === userId ? { ...item, amount: value } : item
            ),
        }));
    };

    return (
        <div className="flex flex-col gap-2">
            {transaction.amounts.map((item: any) => {
                return <BaseForm key={item.user_id} item={item} changeAmount={changeAmount} />;
            })}

            <p className="text-gray-500">
                合計: ¥ {transaction.amounts.reduce((sum: any, entry: any) => sum + entry.amount, 0)}{" "}
                <span className="text-xs">(税込)</span>
            </p>
        </div>
    );
};

const BaseForm = ({item, changeAmount}: {item:any, changeAmount: any}) => {
    const [user, setUser] = useState<any>(null);
    const { getUser } = useUser();

    useEffect(() => {
        (async () => {
            const res: any = await getUser(item.user_id);
            console.log(res);
            
            setUser(() => res.user);
        })();
    }, []);

    if (user == null) {
        return (
            <div className="flex flex-row gap-4 items-baseline">
                <Skeleton variant="circular"  animation="wave" style={{minWidth:"32px", minHeight:"32px"}} />
                <Skeleton variant="rectangular" width="100%" height={48} animation="wave" />
            </div>
        );
    }

    console.log(typeof item.amount);
    

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
