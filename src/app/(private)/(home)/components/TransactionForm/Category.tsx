"use client";
import { FormControl, Skeleton } from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { useCategory } from "@/src/app/(private)/(home)/api/useCategory";
import { useTransactionContext } from "./main";
import { useUser } from "@/src/hooks/useUser";
interface BigCategory {
    big_category_id: number;
    big_category_name: string;
    small_categories: SmallCategory[];
}

interface SmallCategory {
    small_category_id: number;
    small_category_name: string;
}

interface CategoryList {
    [index: number]: BigCategory;
}

///////////////////////////////////////////////////////////////////////////////
// 本体
// 【機能】
// ①違う大カテゴリーを選択しなおしたら、小カテゴリーを未分類にリセットする
// ②大カテゴリーが選択されたら、それに関連する小カテゴリーに切り替える
// ③大カテゴリーが選択されていない時は、小カテゴリーを選択不可にする
///////////////////////////////////////////////////////////////////////////////
export const TransactionFormCategory = () => {
    const { transaction, changeTransaction } = useTransactionContext();
    const [categoryList, setCategoryList] = useState<CategoryList | null>(null);
    const { getCategories } = useCategory();

    useEffect(() => {
        (async () => {
            const res = await getCategories(transaction.type);
            changeTransaction("big_category_id", res?.data[0].big_category_id);
            changeTransaction("small_category_id", res?.data[0].small_categories[0].small_category_id);
            setCategoryList(() => res?.data);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transaction.type]);

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
// 大カテゴリー
///////////////////////////////////////////////////////////////////////////////
const BigCategorySelector = (categoryList: CategoryList) => {
    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();
    const changeBig = (newBigCategoryId: any) => changeTransaction("big_category_id", newBigCategoryId);

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
// 小カテゴリー
///////////////////////////////////////////////////////////////////////////////
const SmallCategorySelector = (categoryList: CategoryList) => {
    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();
    const changeSmall = (newSmallCategoryId: number) => changeTransaction("small_category_id", newSmallCategoryId);
    const [smallCategoryList, setSmallCategoryList] = useState<SmallCategory[]>(categoryList[0].small_categories);

    useEffect(() => {
        (async () => {
            const bigCategory: BigCategory = await Object.values(categoryList).find(
                (bigCategory: BigCategory) => bigCategory.big_category_id == transaction.big_category_id
            );

            setSmallCategoryList(() => bigCategory?.small_categories);

            const firstId = bigCategory.small_categories[0].small_category_id;

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
                // disabled={transaction.big_category_id === 1 ? true : false}
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
