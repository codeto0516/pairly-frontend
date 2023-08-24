"use client";
import { FormControl, Skeleton } from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useCallback, useEffect, useState } from "react";
import { CategoryList } from "../../../datas/category";
import { useTransactionContext } from "@/src/components/features/transaction/TransactionForm";
import { useUserData } from "@/src/providers/SessionProvider";

interface SmallCategory {
    small_category_id: number;
    small_category: string;
}

interface Props {
    changeBig: (newBig: number) => void;
    changeSmall: (newSmall: number) => void;
    smallList: SmallCategory[];
    categoryList: any;
}



///////////////////////////////////////////////////////////////////////////////
// 本体
// 【機能】
// ①違う大カテゴリーを選択しなおしたら、小カテゴリーを未分類にリセットする
// ②大カテゴリーが選択されたら、それに関連する小カテゴリーに切り替える
// ③大カテゴリーが選択されていない時は、小カテゴリーを選択不可にする
///////////////////////////////////////////////////////////////////////////////
export const CategorySelectorButton = (): any => {
    const [categoryList, setCategoryList] = useState<any>(null);
    // const { getAllCategories } = useCategory();
    const user = useUserData();

    useEffect(() => {
        (async () => {
            const res = await fetch("http://localhost:80/api/v1/categories", {
                cache: "force-cache",
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await res.json();
            setCategoryList(() => data);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex w-full gap-1 mt-2">
            {categoryList ? (
                <>
                    <BigCategorySelector {...categoryList} />
                    <SmallCategorySelector {...categoryList} />
                </>
            ) : (
                <>
                    <Skeleton variant="rounded" animation="wave" height={40} style={{ width: "100%" }} />
                    <Skeleton variant="rounded" animation="wave" height={40} style={{ width: "100%" }} />
                </>
            )}
        </div>
    );
};

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////
const BigCategorySelector = (categoryList: any) => {
    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();

    const changeBig = (newBig: any) => changeTransaction("big_category_id", newBig);

    return (
        <FormControl sx={{ m: 0, width: "100%" }} size="small">
            <InputLabel>大カテゴリー</InputLabel>
            <Select
                value={transaction.big_category_id}
                label="大カテゴリー"
                onChange={(e) => changeBig(Number(e.target.value))}
            >
                {Object.values(categoryList).map((item: any, index: number) => {
                    return (
                        <MenuItem key={index} value={item.big_category_id}>
                            {item.big_category_name}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////
const SmallCategorySelector = (categoryList: any) => {
    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();

    const changeSmall = (newSmall: number) => changeTransaction("small_category_id", newSmall);

    const [smallCategoryList, setSmallCategoryList] = useState(categoryList[0].small_categories);

    useEffect(() => {
        (async () => {
            const result: any = await Object.values(categoryList).find(
                (item: any) => item.big_category_id == transaction.big_category_id
            );

            setSmallCategoryList(() => result?.small_categories);

            const firstId = result.small_categories[0].small_category_id;

            changeTransaction("small_category_id", firstId);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction.big_category_id]);

    return (
        <FormControl sx={{ m: 0, width: "100%" }} size="small">
            <InputLabel>大カテゴリー</InputLabel>
            <Select
                value={transaction.small_category_id}
                label="大カテゴリー"
                onChange={(e) => changeSmall(Number(e.target.value))}
                disabled={transaction.big_category_id === 1 ? true : false}
            >
                {Object.values(smallCategoryList).map((item: any, index: number) => {
                    return (
                        <MenuItem key={index} value={item.small_category_id}>
                            {item.small_category_name}
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
};
