"use client";

import { ContainerTop } from "@/src/components/layouts/Container";
import { TransactionListWrapper } from "./components/TransactionList/ListWrapper";
import { useToggle } from "@/src/hooks/useToggle";
import { useUser } from "@/src/hooks/useUser";
import { Transaction } from "./types/transaction";
import { format } from "date-fns";
import { TransactionForm } from "./components/TransactionForm/main";
import { FloatingButton } from "@/src/components/inputs/button/FloatingButton";
import { Modal } from "@mui/material";
import { CloseButton } from "@/src/components/inputs/button/IconButton";
import { motion } from "framer-motion";

const Page = () => {
    return (
        <ContainerTop>
            <div className="flex flex-col md:flex-row gap-8 w-full">
                {/* 取引の新規登録フォーム */}
                <NewTransactionForm />

                {/* 取引一覧とその他のコンポーネント */}
                <TransactionListWrapper />
            </div>
        </ContainerTop>
    );
};

export default Page;

///////////////////////////////////////////////////////////////////////////
// 取引の新規登録フォーム
///////////////////////////////////////////////////////////////////////////
const NewTransactionForm = () => {
    const [isModal, toggleModal] = useToggle();
    const { currentUser } = useUser();
    if (!currentUser) return null;

    // 新規データ
    const newTransaction: Transaction = {
        paidDate: format(new Date(), "yyyy-MM-dd"),
        type: "spending",
        bigCategoryId: 1,
        smallCategoryId: 2,
        content: "",
        amounts: currentUser.partner
            ? [
                  { userId: currentUser.localId, amount: 0 },
                  { userId: currentUser.partner.localId, amount: 0 },
              ]
            : [{ userId: currentUser.localId, amount: 0 }],

        createdBy: currentUser.localId,
    };

    return (
        <>
            {/* 【PC】常時表示 */}
            <div className="hidden md:block min-w-[350px] border h-fit rounded-md overflow-hidden">
                <TransactionForm transaction={newTransaction} />
            </div>

            {/* 【SP】フローティングボタンでモーダル表示 */}
            <div className="md:hidden ">
                <FloatingButton onClick={() => toggleModal(true)} />
                <Modal
                    open={isModal}
                    onClose={() => toggleModal(false)}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        "&:focus": {
                            outline: "none", // フォーカス時にアウトラインを削除
                        },
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-[350px] rounded-md overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0">
                            <CloseButton onClick={() => toggleModal(false)} />
                        </div>
                        <TransactionForm transaction={newTransaction} toggleModal={toggleModal} />
                    </motion.div>
                </Modal>
            </div>
        </>
    );
};
