"use client";
import { IconButton, Pagination } from "@mui/material";
import { DisplayMonthSelectorButton } from "./DisplayMonthSelectorButton";
import { DisplayNumberSelectorButton } from "./DisplayNumberSelectorButton";
import { TransactionList } from "./TransactionList";
import SearchBox from "./SearchBox";
import { FloatingButton } from "@/src/components/elements/button/FloatingButton";
import { useState } from "react";
import { TransactionForm } from "../../components/elements/transaction/TransactionForm";
import { TransactionType } from "@/src/types/transaction";
import { format } from "date-fns";
import { Modal } from "@/src/components/elements/utils/Modal";
import { CloseButton } from "@/src/components/elements/button/IconButton";

const Page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // 新規データ
    const [newTransaction, setNewTransaction] = useState<TransactionType>({
        date: format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS"),
        type: "spending",
        big_category_id: 1,
        small_category_id: 1,
        content: "",
        user: "まゆみ",
        description: [
            { user: "まゆみ", amount: 0 },
            { user: "たいせい", amount: 0 },
        ],
    });

    return (
        <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* -----------------------------------------------------------------------
             取引新規作成フォーム
            ----------------------------------------------------------------------- */}
            {/* 【SP】フローティングボタンでモーダル表示 */}
            <div className="md:hidden ">
                <FloatingButton onClick={openModal} />
                <Modal open={isModalOpen} onClose={closeModal}>
                    <div className="w-[350px] rounded-md overflow-hidden">
                        <div className="absolute top-0 right-0">
                            <CloseButton onClick={closeModal} />
                        </div>
                        <TransactionForm transaction={newTransaction} />
                    </div>
                </Modal>
            </div>
            {/* 【PC】常時表示 */}
            <div className="hidden md:block min-w-[350px] border h-fit rounded-md overflow-hidden">
                <TransactionForm transaction={newTransaction} />
            </div>

            {/* -----------------------------------------------------------------------
             取引一覧
            ----------------------------------------------------------------------- */}
            <div className="flex flex-col gap-4 w-full">
                {/* 検索ボックス */}
                <SearchBox />

                {/* <DisplayMonthSelectorButton /> */}

                {/* 表示件数を選択するボタン */}
                <div className="flex justify-end w-full gap-2 ju">
                    {/* 表示する月を選択 */}
                    {/* <DisplayOrderSelectorButton /> */}
                    <DisplayNumberSelectorButton />
                </div>

                {/* 取引記録一覧を表示 */}
                <TransactionList />

                {/* ページネーション */}
                <Pagination count={3} page={1} shape="rounded" className="flex justify-center mt-8" />
            </div>
        </div>
    );
};

export default Page;
