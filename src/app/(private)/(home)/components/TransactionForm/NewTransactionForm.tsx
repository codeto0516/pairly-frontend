"use client";

import { useToggle } from "@/src/hooks/useToggle";
import { useUser } from "@/src/hooks/useUser";
import { format } from "date-fns";
import { Transaction } from "../../types/transaction";
import { TransactionForm, TransactionFormModal } from "./TransactionForm";
import { FloatingButton } from "@/src/components/inputs/button/FloatingButton";

export const NewTransactionForm = () => {
    const [isModal, toggleModal] = useToggle();
    const { currentUser } = useUser();
    if (!currentUser) return null;

    // 新規データ
    const newTransactionData: Transaction = {
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
                <TransactionForm transaction={newTransactionData} />
            </div>

            {/* 【SP】フローティングボタンでモーダル表示 */}
            <div className="md:hidden ">
                <FloatingButton onClick={() => toggleModal(true)} />
                <TransactionFormModal transaction={newTransactionData} isModal={isModal} toggleModal={toggleModal} />
            </div>
        </>
    );
};
