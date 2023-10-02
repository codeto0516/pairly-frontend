"use client";

import { useContext, useState, createContext, useEffect, useCallback, memo, SetStateAction } from "react";

// Material UI
import { Button, Modal } from "@mui/material";

// 自作コンポーネント
// 型定義
import { Transaction } from "../../types/transaction";
import { useToggle } from "@/src/hooks/useToggle";
import { LoadingButton } from "@mui/lab";
import { useTransaction } from "@/src/app/(private)/(home)/api/useTransaction";
import { useRecoilState } from "recoil";
import { TransactionFormDate } from "./Date";
import { TransactionFormCategory } from "./Category";
import { TransactionFormContent } from "./Content";
import { TransactionFormAmount } from "./Amount";
import { DeleteDialog } from "@/src/components/utils/Dialog";
import { motion } from "framer-motion";
import { CloseButton } from "@/src/components/inputs/button/IconButton";
import {
    transactionListState,
    addTransaction as addTransactionAction,
    updateTransaction as updateTransactionAction,
    deleteTransaction as deleteTransactionAction,
} from "../../stores/transactionList";
// useContext
export const TransactionContext = createContext<any>({});
export const useTransactionContext = () => useContext(TransactionContext);

//////////////////////////////////////////////////////////////////////////////////
// 本体（モーダル表示）
//////////////////////////////////////////////////////////////////////////////////
export const TransactionFormModal = (props: {
    isModal: boolean;
    toggleModal: (value: boolean) => void;
    transaction: Transaction;
}) => {
    return (
        <Modal
            open={props.isModal}
            onClose={() => props.toggleModal(false)}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-[350px] rounded-md overflow-hidden relative outline-none"
            >
                <div className="absolute top-0 right-0">
                    <CloseButton onClick={() => props.toggleModal(false)} />
                </div>
                <TransactionForm transaction={props.transaction} toggleModal={props.toggleModal} />
            </motion.div>
        </Modal>
    );
};

//////////////////////////////////////////////////////////////////////////////////
// 本体（通常表示）
//////////////////////////////////////////////////////////////////////////////////
export const TransactionForm = (props: { transaction: Transaction; toggleModal?: (value: boolean) => void }) => {
    // 新規取引かどうか
    const isNewTransaction = props.transaction.id ? false : true;

    // 取引の初期値を保持（保存後にフォームを初期化するため）
    const initialTransaction = props.transaction;

    // 取引の状態
    const [transaction, setTransaction] = useState(props.transaction);
    const changeTransaction = useCallback((field: string, value: string | number) => {
        setTransaction((prevTransaction) => ({ ...prevTransaction, [field]: value }));
    }, []);

    //////////////////////////////////////////////////////////////////////////////////
    return (
        <TransactionContext.Provider value={{ transaction, changeTransaction, setTransaction }}>
            <div className="flex flex-col gap-2 text-sx bg-white w-full px-8 py-10">
                {isNewTransaction ? (
                    <div className="flex justify-end items-center">
                        {/* 日付 */}
                        <TransactionFormDate />
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        {/* 削除ボタン */}
                        <DeleteButton transaction={transaction} />

                        {/* 日付 */}
                        <TransactionFormDate />
                    </div>
                )}

                {/* カテゴリー選択ボタン */}
                <TransactionFormCategory />

                {/* 金額入力欄 */}
                <TransactionFormAmount transaction={transaction} setTransaction={setTransaction} />

                {/* 購入内容等の入力フォーム */}
                <TransactionFormContent />

                {/* ボタン */}
                {isNewTransaction ? (
                    <SaveButton
                        initialTransaction={initialTransaction}
                        toggleModal={props.toggleModal}
                        transaction={transaction}
                        setTransaction={setTransaction}
                    />
                ) : (
                    <UpdateButton transaction={transaction} toggleModal={props.toggleModal} />
                )}
            </div>
        </TransactionContext.Provider>
    );
};

///////////////////////////////////////////////////////////////////////////////////////
// 保存ボタン
///////////////////////////////////////////////////////////////////////////////////////
const SaveButton = (props: {
    initialTransaction: Transaction;
    toggleModal?: (value: boolean) => void;
    transaction: Transaction;
    setTransaction: (value: React.SetStateAction<Transaction>) => void;
}) => {
    // ローディング、ボタンの状態
    const [isLoading, toggleLoading] = useToggle(false);
    const [isButtonDisable, toggleButtonDisable] = useToggle(true);

    // API
    const { createTransaction } = useTransaction();

    // 取引リストの状態
    const [transactionList, setTransactionList] = useRecoilState<any>(transactionListState);

    useEffect(() => {
        const totalAmout = props.transaction.amounts.reduce((sum: any, entry: any) => sum + entry.amount, 0);
        // フォームが編集されたら検知して保存ボタンのDisabledを解除
        totalAmout === 0 ? toggleButtonDisable(true) : toggleButtonDisable(false);
    }, [props.transaction.amounts]);

    // 保存
    const handleSave = async () => {
        // ローディングを表示
        toggleLoading(true);
        const res = await createTransaction(props.transaction);
        if (res.ok) {
            // 保存ボタンを無効化
            toggleButtonDisable(true);

            // レスポンスされた取引を取引リストに追加
            const newTransactionList = addTransactionAction(res.data.transaction)(transactionList);
            setTransactionList(newTransactionList);

            // フォームを初期化
            props.setTransaction(props.initialTransaction);

            // モーダルを閉じる
            props.toggleModal?.(false);
        }
        // ローディングを非表示
        toggleLoading(false);
    };

    return (
        <LoadingButton variant="outlined" onClick={handleSave} loading={isLoading} disabled={isButtonDisable}>
            保存
        </LoadingButton>
    );
};

///////////////////////////////////////////////////////////////////////////////////////
// 更新ボタン
///////////////////////////////////////////////////////////////////////////////////////
const UpdateButton = (props: { transaction: Transaction; toggleModal?: (value: boolean) => void }) => {
    const { updateTransaction } = useTransaction();

    const [isLoading, toggleLoading] = useToggle(false);
    const [isButtonDisable, toggleButtonDisable] = useToggle(true);

    // 取引リストの状態
    const [transactionList, setTransactionList] = useRecoilState<any>(transactionListState);

    // 更新
    const handleUpdate = async () => {
        // ローディングを表示
        toggleLoading(true);
        const res: any = await updateTransaction(props.transaction);
        if (res.ok) {
            const updatedTransactionList = updateTransactionAction(res.data.transaction)(transactionList);
            setTransactionList(updatedTransactionList);
            toggleButtonDisable(true);
        }
        toggleLoading(false);

        // モーダルを閉じる
        props.toggleModal?.(false);
    };

    useEffect(() => {
        const totalAmout = props.transaction.amounts.reduce((sum: any, entry: any) => sum + entry.amount, 0);
        // フォームが編集されたら検知して保存ボタンのDisabledを解除
        totalAmout === 0 ? toggleButtonDisable(true) : toggleButtonDisable(false);
    }, [props.transaction.amounts]);

    return (
        <LoadingButton variant="outlined" onClick={handleUpdate} loading={isLoading} disabled={isButtonDisable}>
            変更
        </LoadingButton>
    );
};

///////////////////////////////////////////////////////////////////////////////////////
// 削除ボタン
///////////////////////////////////////////////////////////////////////////////////////
const DeleteButton = (props: { transaction: Transaction }) => {
    const { delteTransaction } = useTransaction();

    // ダイアログ、ローディング、ボタンの状態
    const [isDialog, toggleDialog] = useToggle(false);

    // 取引リストの状態
    const [transactionList, setTransactionList] = useRecoilState<any>(transactionListState);

    // 削除
    const handleDelete = async () => {
        if (props.transaction.id) {
            const res = await delteTransaction(props.transaction.id);
            if (res.ok) {
                const updatedTransactionList = deleteTransactionAction(props.transaction.id)(transactionList);
                setTransactionList(updatedTransactionList);
            }
        }
    };
    return (
        <div>
            <Button className="text-sm text-red-500" onClick={() => toggleDialog(true)}>
                削除する
            </Button>
            <DeleteDialog open={isDialog} handleExec={handleDelete} handleClose={() => toggleDialog(false)} />
        </div>
    );
};
