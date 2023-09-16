import TextField from "@mui/material/TextField";
import { InputAdornment, Skeleton } from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Amount, Transaction } from "../../types/transaction";
import { UserIcon } from "@/src/components/dataDisplay/UsersIcon";
import { useTransactionContext } from "./main";
import { useUser } from "@/src/hooks/useUser";
import { User } from "@/src/types/user";

export const TransactionFormAmount = () => {
    const { transaction } = useTransactionContext();

    return (
        <div className="flex flex-col gap-2">
            {transaction.amounts.map((item: Amount) => {
                return <BaseAmountForm key={item.userId} item={item} />;
            })}

            <p className="text-gray-500">
                合計: ¥ {transaction.amounts.reduce((sum: any, entry: any) => sum + entry.amount, 0)}
                <span className="text-xs"> (税込)</span>
            </p>
        </div>
    );
};

const BaseAmountForm = (props: { item: any }) => {
    const { setTransaction } = useTransactionContext();
    const [user, setUser] = useState<User | null>(null);
    const { getUser } = useUser();
    const [value, setValue] = useState(props.item.amount);
    const inputRef = useRef<HTMLInputElement>(null);

    const changeAmount = (e: ChangeEvent<HTMLInputElement>) => {
        const userId = props.item.userId;
        const amount = Number(e.target.value);

        setTransaction((prevTransaction: Transaction) => ({
            ...prevTransaction,
            amounts: prevTransaction.amounts.map((item: any) =>
                item.userId === userId ? { ...item, amount: amount } : item
            ),
        }));
    };

    useEffect(() => {
        (async () => {
            const user: any = await getUser(props.item.userId);
            setUser(() => user);
        })();
    }, []);

    useEffect(() => {
        if (props.item.amount === 0) {
            setValue(() => null);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        } else {
            setValue(props.item.amount);
        }
    }, [props.item.amount]);

    if (user == null) {
        return (
            <div className="flex flex-row gap-4 items-baseline">
                <Skeleton variant="circular" animation="wave" style={{ minWidth: "32px", minHeight: "32px" }} />
                <Skeleton variant="rectangular" animation="wave" width="100%" height={48} />
            </div>
        );
    }

    return (
        <div key={props.item.userId} className="flex items-end gap-4">
            {/* ユーザーアイコン */}
            <UserIcon label={user.displayName ?? user.email} image={user.photoUrl} />
            {/* 入力フォーム */}
            <TextField
                inputRef={inputRef}
                label={`${user.displayName ?? user.email} の支払い額を入力`}
                variant="standard"
                className="w-full"
                type="number"
                value={value}
                onChange={changeAmount}
                InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                }}
            />
        </div>
    );
};
