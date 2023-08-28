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
// import { LoadingButton } from "@/src/components/elements/button/LoadingButton";
import { DeleteDialog } from "@/src/components/elements/utils/Dialog";

// 型定義
import { TransactionType } from "@/src/types/transaction";
import { useToggle } from "@/src/hooks/useToggle";
import { LoadingButton } from "@mui/lab";
import { useUserData } from "@/src/providers/SessionProvider";
import { useTransaction } from "@/src/hooks/api/useTransaction";
import { useUser } from "@/src/hooks/api/useUser";
import { useRouter } from "next/navigation";

// useContext
export const TransactionContext = createContext<any>({});
export const useTransactionContext = () => useContext(TransactionContext);

//////////////////////////////////////////////////////////////////////////////////
// 本体
//////////////////////////////////////////////////////////////////////////////////
export const TransactionForm = (props: { transaction: TransactionType }) => {
    const [isDialog, toggleDialog] = useToggle(false);
    const [isLoading, toggleLoading] = useToggle(false);
    const { sendTransaction, updateTransaction, delteTransaction } = useTransaction();

    const [isNewTransaction] = useState(props.transaction.id ? false : true);

    const [transaction, setTransaction] = useState(props.transaction);
    const changeTransaction = useCallback((field: string, value: string | number) => {
        setTransaction((prevTransaction) => ({ ...prevTransaction, [field]: value }));
    }, []);

    // 保存ボタンを押したらサーバーに送信
    const handleSave = async () => {
        sendTransaction(transaction);
    };

    const handleUpdate = () => {
        updateTransaction(transaction);
    };

    const handleDelete = async () => {
        if (transaction.id) {
            const res = await delteTransaction(transaction.id);
        }
    };

    const [isButtonDisable, toggleButtonDisable] = useToggle(false);
    useEffect(() => {
        // フォームが編集されたら検知して保存ボタンのDisabledを解除
        toggleButtonDisable();
        // console.log(transaction);

        // eslint-disable-next-line react-hooks/exhaustive-deps
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

                {isNewTransaction ? (
                    <LoadingButton variant="outlined" onClick={handleSave} loading={isLoading}>
                        保存
                    </LoadingButton>
                ) : (
                    <LoadingButton variant="outlined" onClick={handleUpdate} loading={isLoading}>
                        変更
                    </LoadingButton>
                )}
            </div>
        </TransactionContext.Provider>
    );
};
