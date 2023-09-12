"use client";

import { ContainerTop } from "@/src/components/layouts/Container";
import { TransactionListWrapper } from "./components/TransactionList/ListWrapper";
import { useToggle } from "@/src/hooks/useToggle";
import { useUser } from "@/src/hooks/useUser";
import { TransactionType } from "./types";
import { format } from "date-fns";
import { TransactionForm } from "./components/TransactionForm/main";
import { FloatingButton } from "@/src/components/inputs/button/FloatingButton";
import { Modal } from "@mui/material";
import { CloseButton } from "@/src/components/inputs/button/IconButton";

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
    const partner = null;

    // 新規データ
    const newTransaction: TransactionType = {
        paid_date: format(new Date(), "yyyy-MM-dd"),
        type: "spending",
        big_category_id: 1,
        small_category_id: 1,
        content: "",
        amounts: partner
            ? [
                  { user_id: currentUser.uid, amount: 0 },
                  { user_id: partner, amount: 0 },
              ]
            : [{ user_id: currentUser.uid, amount: 0 }],

        created_by: currentUser.uid,
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
                <Modal open={isModal} onClose={() => toggleModal(false)}>
                    <div className="w-[350px] rounded-md overflow-hidden">
                        <div className="absolute top-0 right-0">
                            <CloseButton onClick={() => toggleModal(false)} />
                        </div>
                        <TransactionForm transaction={newTransaction} />
                    </div>
                </Modal>
            </div>
        </>
    );
};
