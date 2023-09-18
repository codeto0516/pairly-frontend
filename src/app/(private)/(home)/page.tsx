"use client";

import { ContainerTop } from "@/src/components/layouts/Container";
import { useToggle } from "@/src/hooks/useToggle";
import { useUser } from "@/src/hooks/useUser";
import { Transaction } from "./types/transaction";
import { format } from "date-fns";
import { TransactionForm, TransactionFormModal } from "./components/TransactionForm/main";
import { FloatingButton } from "@/src/components/inputs/button/FloatingButton";
import { useRecoilState, useRecoilValue } from "recoil";
import { countSelector, pageSelector } from "./stores/transactionListParams";
import { YearMonthSelectorButton } from "./components/SearchBox/YearMonthSelector";
import { PerPageSelectorButton } from "./components/SearchBox/PerPage";
import { TransactionList } from "./components/TransactionList/main";
import { Pagination } from "@mui/material";
import { ChangeEvent } from "react";

const Page = () => {
    const [page, setPage] = useRecoilState<number>(pageSelector);
    const count = useRecoilValue(countSelector);
    const total = useRecoilValue(countSelector);
    return (
        <ContainerTop>
            <div className="flex flex-col md:flex-row gap-8 w-full">
                {/* 取引の新規登録フォーム */}
                <NewTransactionForm />

                {/* 取引一覧とその他のコンポーネント */}
                <div className="flex flex-col gap-4 w-full">
                    {/* 検索ボックス */}
                    {/* <SearchBox /> */}

                    {/* 表示件数を選択するボタン */}
                    <div className="flex justify-between w-full gap-2 ju">
                        {/* 表示する月を選択 */}
                        <YearMonthSelectorButton />

                        {/* 表示件数 */}
                        <PerPageSelectorButton />
                    </div>

                    {/* 取引記録一覧を表示 */}
                    <TransactionList />

                    {/* ページネーション */}
                    {total >= 1 && (
                        <Pagination
                            page={page}
                            count={count}
                            onChange={(e: ChangeEvent<unknown>, page: number) => setPage(page)}
                            shape="rounded"
                            className="flex justify-center mt-8"
                        />
                    )}
                </div>
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
                <TransactionFormModal transaction={newTransaction} isModal={isModal} toggleModal={toggleModal} />
            </div>
        </>
    );
};
