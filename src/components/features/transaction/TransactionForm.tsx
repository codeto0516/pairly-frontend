"use client";

import { useContext, useState, createContext, useEffect, Suspense, useCallback } from "react";

// Material UI
import { Button, Skeleton } from "@mui/material";

// 自作コンポーネント
import { DateSelectorButton } from "@/src/components/features/transaction/DateSelectorButton";
import { TypeToggleButton } from "@/src/components/features/transaction/TypeToggleButton";
import { CategorySelectorButton } from "@/src/components/features/transaction/CategorySelectorButton";
import { ContentForm } from "@/src/components/features/transaction/ContentForm";
import { AmountForm } from "@/src/components/features/transaction/AmountForm";
import { LoadingButton } from "@/src/components/elements/button/LoadingButton";
import { DeleteDialog } from "@/src/components/elements/utils/Dialog";

// 型定義
import { TransactionType } from "@/src/types/transaction";
import { useToggle } from "@/src/hooks/useToggle";

// useContext
export const TransactionContext = createContext<any>({});
export const useTransactionContext = () => useContext(TransactionContext);

/* -----------------------------------------------------------------------
 サーバーに送信
----------------------------------------------------------------------- */
const sendTransactionData = async () => {
    console.log("送信中・・");

    // Promiseを作成
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("success"); // 非同期処理完了を通知
        }, 2000);
    });

    // Promiseが完了するまで待つ
    return await promise;
};

/* -----------------------------------------------------------------------
 本体
----------------------------------------------------------------------- */
export const TransactionForm = (props: { transaction: TransactionType }) => {
    const [isDialog, toggleDialog] = useToggle(false);

    const [isNewTransaction] = useState(props.transaction.id ? false : true);

    const [transaction, setTransaction] = useState(props.transaction);
    const changeTransaction = useCallback((field: any, value: any) => {
        setTransaction((prevTransaction) => ({ ...prevTransaction, [field]: value }));
    }, []);

    // 保存ボタンを押したらサーバーに送信
    const handleSave = async () => {
        // Promiseが完了するまで待つ
        const result = await sendTransactionData();
        console.log(result);
        console.log("以下を送信しました");
    };

    const handleDelete = () => {
        console.log("削除します");
    };

    const [isButtonDisable, toggleButtonDisable] = useToggle(false);
    useEffect(() => {
        // フォームが編集されたら検知して保存ボタンのDisabledを解除
        toggleButtonDisable()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction]);

    /* -----------------------------------------------------------------------
    ----------------------------------------------------------------------- */
    return (
        <TransactionContext.Provider value={{ transaction, changeTransaction }}>
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
                    <DateSelectorButton />
                </div>

                {/* タイプ（支出 or 収入）選択ボタン */}
                <TypeToggleButton />

                {/* カテゴリー選択ボタン */}
                <CategorySelectorButton />

                {/* 金額入力欄 */}
                <AmountForm />

                {/* 購入内容等の入力フォーム */}
                <ContentForm />

                {/* 保存ボタン */}
                <LoadingButton onClick={handleSave} Disabled={isButtonDisable}>
                    {isNewTransaction ? "保存" : "変更"}
                </LoadingButton>
            </div>
        </TransactionContext.Provider>
    );
};
