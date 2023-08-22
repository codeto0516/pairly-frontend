"use client";
import { Pagination } from "@mui/material";
import { DisplayNumberSelectorButton } from "@/src/components/features/transaction/DisplayNumberSelectorButton";
import { TransactionList } from "@/src/components/features/transaction/TransactionList";
import SearchBox from "@/src/components/elements/form/SearchBox";
import { FloatingButton } from "@/src/components/elements/button/FloatingButton";
import { TransactionForm } from "@/src/components/features/transaction/TransactionForm";
import { format } from "date-fns";
import { Modal } from "@/src/components/elements/utils/Modal";
import { CloseButton } from "@/src/components/elements/button/IconButton";
import { useToggle } from "../hooks/useToggle";

const Page = () => {
    return (
        <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* 取引の新規登録フォーム */}
            <NewTransactionForm />

            {/* 取引一覧とその他のコンポーネント */}
            <TransactionListWrapper />
        </div>
    );
};

export default Page;

///////////////////////////////////////////////////////////////////////////
// 取引一覧とその他のコンポーネント
///////////////////////////////////////////////////////////////////////////
const TransactionListWrapper = () => {
    return (
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
    );
};

///////////////////////////////////////////////////////////////////////////
// 取引の新規登録フォーム
///////////////////////////////////////////////////////////////////////////
const NewTransactionForm = () => {
    const [isModal, toggleModal] = useToggle();

    // 新規データ
    const newTransaction = {
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
