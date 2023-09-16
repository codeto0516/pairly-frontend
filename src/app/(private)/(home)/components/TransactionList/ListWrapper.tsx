import { useRecoilState, useRecoilValue } from "recoil";
import { countSelector, pageSelector } from "../../stores/transactionListParams";
import { SearchBox } from "../SearchBox/main";
import { PerPageSelectorButton } from "../SearchBox/PerPage";
import { TransactionList } from "./main";
import { Pagination } from "@mui/material";
import { ChangeEvent } from "react";
import { YearMonthSelectorButton } from "../SearchBox/YearMonthSelector";

export const TransactionListWrapper = () => {
    const [page, setPage] = useRecoilState<number>(pageSelector);
    const count = useRecoilValue(countSelector);
    const total = useRecoilValue(countSelector);

    return (
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
    );
};
