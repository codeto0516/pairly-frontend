"use client";
import { Pagination } from "@mui/material";
import { PerPageSelectorButton } from "@/src/app/(private)/(root)/components/SearchBox/PerPageSelectorButton";
import { TransactionList } from "@/src/app/(private)/(root)/components/TransactionList";
import SearchBox from "@/src/app/(private)/(root)/components/SearchBox/SearchBox";
import { FloatingButton } from "@/src/components/elements/button/FloatingButton";
import { TransactionForm } from "@/src/app/(private)/(root)/components/TransactionForm/TransactionForm";
import { format } from "date-fns";
import { Modal } from "@/src/components/elements/utils/Modal";
import { CloseButton } from "@/src/components/elements/button/IconButton";
import { useToggle } from "../../../hooks/useToggle";
import { ChangeEvent, useState } from "react";
import { TransactionType } from "../../../types/transaction";
import { useObject } from "../../../hooks/useObject";
import { useRecoilState, useRecoilValue } from "recoil";
import { countSelector, pageSelector } from "@/src/recoil/transactionListParams";
import { useUser } from "@/src/hooks/api/v1/useUser";
import { ContainerTop } from "@/src/components/layouts/Container";

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
// 取引一覧とその他のコンポーネント
///////////////////////////////////////////////////////////////////////////
const TransactionListWrapper = () => {
    const [page, setPage] = useRecoilState<number>(pageSelector);
    const count = useRecoilValue(countSelector);

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* 検索ボックス */}
            <SearchBox />

            {/* <DisplayMonthSelectorButton /> */}

            {/* 表示件数を選択するボタン */}
            <div className="flex justify-end w-full gap-2 ju">
                {/* 表示する月を選択 */}
                {/* <DisplayOrderSelectorButton /> */}
                <PerPageSelectorButton />
            </div>

            {/* 取引記録一覧を表示 */}
            <TransactionList />

            {/* ページネーション */}
            <Pagination
                page={page}
                count={count}
                onChange={(e: ChangeEvent<unknown>, page: number) => setPage(page)}
                shape="rounded"
                className="flex justify-center mt-8"
            />
        </div>
    );
};

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
