"use client";

import { useContext, useState, createContext, useEffect, useCallback, memo } from "react";

// Material UI
import { Button } from "@mui/material";

// 自作コンポーネント
// 型定義
import { Transaction } from "../../types/transaction";
import { useToggle } from "@/src/hooks/useToggle";
import { LoadingButton } from "@mui/lab";
import { useTransaction } from "@/src/app/(private)/(home)/api/useTransaction";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { TransactionFormDate } from "./Date";
import { TransactionFormCategory } from "./Category";
import { TransactionFormContent } from "./Content";
import { TransactionFormAmount } from "./Amount";
import { DeleteDialog } from "@/src/components/utils/Dialog";
import {
    transactionListState,
    transactionListSelector,
    addTransaction as addTransactionAction,
    updateTransaction as updateTransactionAction,
    deleteTransaction as deleteTransactionAction,
} from "../../stores/transactionList";
// useContext
export const TransactionContext = createContext<any>({});
export const useTransactionContext = () => useContext(TransactionContext);

//////////////////////////////////////////////////////////////////////////////////
// 本体
//////////////////////////////////////////////////////////////////////////////////

export const TransactionForm = (props: { transaction: Transaction }) => {
    const [isDialog, toggleDialog] = useToggle(false);
    const [isLoading, toggleLoading] = useToggle(false);
    const [isButtonDisable, toggleButtonDisable] = useToggle(true);

    const { createTransaction, updateTransaction, delteTransaction } = useTransaction();

    const [isNewTransaction] = useState(props.transaction.id ? false : true);

    const [transaction, setTransaction] = useState(props.transaction);
    const changeTransaction = useCallback((field: string, value: string | number) => {
        setTransaction((prevTransaction) => ({ ...prevTransaction, [field]: value }));
    }, []);

    const [transactionList, setTransactionList] = useRecoilState<any>(transactionListState);

    // 保存ボタンを押したらサーバーに送信
    const handleSave = async () => {
        toggleLoading(true);
        const res = await createTransaction(transaction);
        if (res.ok) {
            const newTransactionList = addTransactionAction(res.data)(transactionList);
            setTransactionList(newTransactionList);
            toggleButtonDisable(true);
        }
        toggleLoading(false);
    };

    const handleUpdate = async () => {
        toggleLoading(true);
        const res: any = await updateTransaction(transaction);
        if (res.ok) {
            const updatedTransactionList = updateTransactionAction(res.data)(transactionList);
            setTransactionList(updatedTransactionList);
            toggleButtonDisable(true);
        }
        toggleLoading(false);
    };

    const handleDelete = async () => {
        if (transaction.id) {
            const res = await delteTransaction(transaction.id);
            if (res.ok) {
                const updatedTransactionList = deleteTransactionAction(transaction.id)(transactionList);
                setTransactionList(updatedTransactionList);
            }
        }
    };

    useEffect(() => {
        const totalAmout = transaction.amounts.reduce((sum: any, entry: any) => sum + entry.amount, 0);
        // フォームが編集されたら検知して保存ボタンのDisabledを解除
        totalAmout === 0 ? toggleButtonDisable(true) : toggleButtonDisable(false);
    }, [transaction]);

    //////////////////////////////////////////////////////////////////////////////////
    return (
        <TransactionContext.Provider value={{ transaction, changeTransaction, setTransaction }}>
            <div className="flex flex-col gap-2 text-sx bg-white w-full px-6 py-8">
                {/* 削除ボタンと日付を水平に配置する */}
                <div className="flex justify-between items-center">
                    {/* 削除ボタン */}
                    {isNewTransaction ? (
                        <>
                            <Button className="text-sm text-blue-500" onClick={() => toggleDialog(true)}>
                                清算する
                            </Button>
                            {/* <DeleteDialog
                                open={isDialog}
                                handleExec={handleDelete}
                                handleClose={() => toggleDialog(false)}
                            /> */}
                        </>
                    ) : (
                        <>
                            <Button className="text-sm text-red-500" onClick={() => toggleDialog(true)}>
                                削除する
                            </Button>
                            <DeleteDialog
                                open={isDialog}
                                handleExec={handleDelete}
                                handleClose={() => toggleDialog(false)}
                            />
                        </>
                    )}

                    {/* 日付 */}
                    <TransactionFormDate />
                </div>

                {/* カテゴリー選択ボタン */}
                <TransactionFormCategory />

                {/* 金額入力欄 */}
                <TransactionFormAmount />

                {/* 購入内容等の入力フォーム */}
                <TransactionFormContent />

                {isNewTransaction ? (
                    <LoadingButton
                        variant="outlined"
                        onClick={handleSave}
                        loading={isLoading}
                        disabled={isButtonDisable}
                    >
                        保存
                    </LoadingButton>
                ) : (
                    <LoadingButton
                        variant="outlined"
                        onClick={handleUpdate}
                        loading={isLoading}
                        disabled={isButtonDisable}
                    >
                        変更
                    </LoadingButton>
                )}
            </div>
        </TransactionContext.Provider>
    );
};
