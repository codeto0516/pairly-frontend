import TextField from "@mui/material/TextField";
import { InputAdornment, Skeleton } from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Amount, Transaction } from "../../types/transaction";
import { UserIcon } from "@/src/components/dataDisplay/UsersIcon";
import { useUser } from "@/src/hooks/useUser";
import { Partner, User } from "@/src/types/user";

interface TransactionFormAmountProps {
    transaction: Transaction;
    setTransaction: React.Dispatch<React.SetStateAction<Transaction>>;
}

//////////////////////////////////////////////////////////////////////////////////////////
// 本体
//////////////////////////////////////////////////////////////////////////////////////////
export const TransactionFormAmount = (props: TransactionFormAmountProps) => {
    return (
        <div className="flex flex-col gap-2">
            {props.transaction.amounts.map((userAmount: Amount) => {
                return (
                    <TransactionFormAmountWrapper
                        key={userAmount.userId}
                        userAmount={userAmount}
                        setTransaction={props.setTransaction}
                    />
                );
            })}
            <TotalAmountIncludedTax transactionAmounts={props.transaction.amounts} />
        </div>
    );
};

//////////////////////////////////////////////////////////////////////////////////////////
// ラッパー（アイコン＋金額入力欄）
//////////////////////////////////////////////////////////////////////////////////////////
const TransactionFormAmountWrapper = (props: {
    userAmount: Amount;
    setTransaction: React.Dispatch<React.SetStateAction<Transaction>>;
}) => {
    const { getUser } = useUser();
    const [user, setUser] = useState<User | Partner | null>(null);

    const updateAmount = (newAmount: number) => {
        props.setTransaction((prevTransaction: Transaction) => ({
            ...prevTransaction,
            amounts: prevTransaction.amounts.map((item: any) =>
                item.userId === user?.localId ? { ...item, amount: newAmount } : item
            ),
        }));
    };

    useEffect(() => {
        (async () => {
            const user = await getUser(props.userAmount.userId);
            user && setUser(() => user);
        })();
    }, []);

    return (
        <div className="flex items-end gap-4">
            <UserIcon label={user?.displayName ?? user?.email} image={user?.photoUrl} />
            <TransactionFormAmountInput
                label={user?.displayName ?? user?.email}
                amount={props.userAmount.amount}
                updateAmount={updateAmount}
            />
        </div>
    );
};

//////////////////////////////////////////////////////////////////////////////////////////
// バリデーションチェック
//////////////////////////////////////////////////////////////////////////////////////////
// 入力文字のバリデーション
const isValidInputString = (amount: string): boolean => {
    // 入力できるのは0~9の数字だけで、先頭に0は不可
    return /^[1-9][0-9]*$/.test(amount) || amount === "0";
};

// 金額のバリデーション
const isValidAmountRange = (amount: number): boolean => {
    const MIN = 0;
    const MAX = 999999999;
    return amount >= MIN && amount <= MAX;
};

//////////////////////////////////////////////////////////////////////////////////////////
// 金額入力フォーム
//////////////////////////////////////////////////////////////////////////////////////////
const TransactionFormAmountInput = (props: {
    label: string | undefined;
    amount: number;
    updateAmount: (amount: number) => void;
}) => {
    const [displayValue, setDisplayValue] = useState<string>(props.amount.toString());
    const inputRef = useRef<HTMLInputElement>(null);

    const clearDisplayValue = () => {
        setDisplayValue(() => "");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const updateDisplayValue = (value: string) => setDisplayValue(() => value);

    const changeAmount = (newValue: string): void => {
        const amountAsString = newValue;
        const amountAsNumber = Number(amountAsString);

        // 入力文字のバリデーション
        if (!isValidInputString(amountAsString)) {
            clearDisplayValue();
            props.updateAmount(0);
            return;
        }

        // 金額の範囲チェック
        if (isValidAmountRange(amountAsNumber)) {
            updateDisplayValue(amountAsString);
            props.updateAmount(amountAsNumber);
        }
    };

    useEffect(() => { 
        changeAmount(props.amount.toString());
    }, [props.amount]);

    // データ取得中はスケルトン
    if (props.amount === undefined) {
        return <Skeleton variant="rectangular" animation="wave" width="100%" height={48} />;
    }

    return (
        <TextField
            inputRef={inputRef}
            label={props.label ? `${props.label}の支払い額を入力` : "支払い額を入力"}
            variant="standard"
            className="w-full"
            type="number"
            value={displayValue === "0" ? "" : displayValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => changeAmount(e.target.value)}
            InputProps={{
                startAdornment: <InputAdornment position="start">¥</InputAdornment>,
            }}
        />
    );
};

//////////////////////////////////////////////////////////////////////////////////////////
// 合計表示
//////////////////////////////////////////////////////////////////////////////////////////
const TotalAmountIncludedTax = (props: { transactionAmounts: Amount[] }) => {
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const calcTotalAmountIncludedTax = (amounts: Amount[]) => {
        return amounts.reduce((sum: any, entry: any) => sum + entry.amount, 0);
    };

    useEffect(() => {
        setTotalAmount(() => calcTotalAmountIncludedTax(props.transactionAmounts));
    }, [props.transactionAmounts]);

    return (
        <p className="text-gray-500">
            合計: ¥ {totalAmount} <span className="text-xs">(税込)</span>
        </p>
    );
};
