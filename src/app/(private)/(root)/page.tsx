"use client";
import { Pagination } from "@mui/material";
import { PerPageSelectorButton } from "@/src/app/(private)/(root)/conponents/SearchBox/PerPageSelectorButton";
import { TransactionList } from "@/src/app/(private)/(root)/conponents/TransactionList";
import SearchBox from "@/src/app/(private)/(root)/conponents/SearchBox/SearchBox";
import { FloatingButton } from "@/src/components/elements/button/FloatingButton";
import { TransactionForm } from "@/src/app/(private)/(root)/conponents/TransactionForm/TransactionForm";
import { format } from "date-fns";
import { Modal } from "@/src/components/elements/utils/Modal";
import { CloseButton } from "@/src/components/elements/button/IconButton";
import { useToggle } from "../../../hooks/useToggle";
import { ChangeEvent, useState } from "react";
import { TransactionType } from "../../../types/transaction";
import { useUserData } from "../../../providers/SessionProvider";
import { useObject } from "../../../hooks/useObject";

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
const TransactionListWrapper = (handleChange: any) => {
    // ページネーションの設定
    const [pagenation, changePagenation] = useObject<{ page: number; count: number; perPage: number }>({
        page: 1,
        count: 1,
        perPage: 10,
    });

    // ページの変更
    const changePage = (page: number) => changePagenation("page", page);
    const changePerPage = (perPage: number) => changePagenation("perPage", perPage);

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* 検索ボックス */}
            <SearchBox />

            {/* <DisplayMonthSelectorButton /> */}

            {/* 表示件数を選択するボタン */}
            <div className="flex justify-end w-full gap-2 ju">
                {/* 表示する月を選択 */}
                {/* <DisplayOrderSelectorButton /> */}
                <PerPageSelectorButton perPage={pagenation.perPage} changePerPage={changePerPage} />
            </div>

            {/* 取引記録一覧を表示 */}
            <TransactionList pagenation={pagenation} changePagenation={changePagenation} />

            {/* ページネーション */}
            <Pagination
                page={pagenation.page}
                count={pagenation.count}
                onChange={(e: ChangeEvent<unknown>, page: number) => changePage(page)}
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
    const { user, partner } = useUserData();

    // 新規データ
    const newTransaction: TransactionType = {
        paid_date: format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS"),
        type: "spending",
        big_category_id: 1,
        small_category_id: 1,
        content: "",
        amounts: partner
            ? [
                  { user_id: user.id, amount: 0 },
                  { user_id: partner.id, amount: 0 },
              ]
            : [{ user_id: user.id, amount: 0 }],

        created_by: user.id,
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
