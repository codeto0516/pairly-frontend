"use client";
import { FormControl, Skeleton } from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { useCategory } from "@/src/app/(private)/(home)/api/useCategory";
import { useTransactionContext } from "./main";
import { ToggleButton } from "@/src/components/inputs/button/ToggleButton";
import { useToggle } from "@/src/hooks/useToggle";

export interface BigCategory {
    big_category_id: number;
    big_category_name: string;
    small_categories: SmallCategory[];
}

export interface SmallCategory {
    small_category_id: number;
    small_category_name: string;
}

type CategoryType = "spending" | "income";

const categoryTypeList = [
    { title: "支出", value: "spending" },
    { title: "収入", value: "income" },
];

///////////////////////////////////////////////////////////////////////////////
// 【機能】
// ①違う大カテゴリーを選択しなおしたら、小カテゴリーを未分類にリセットする
// ②大カテゴリーが選択されたら、それに関連する小カテゴリーに切り替える
// ③大カテゴリーが選択されていない時は、小カテゴリーを選択不可にする
///////////////////////////////////////////////////////////////////////////////
export const TransactionFormCategory = () => {
    const { transaction, _ } = useTransactionContext();
    const [categoryList, setCategoryList] = useState<BigCategory[] | undefined>(undefined);
    const [smallCategoryList, setSmallCategoryList] = useState<SmallCategory[] | undefined>(undefined);
    const { getCategories } = useCategory();
    const [isChangeBigCategory, toggleIsChangeBigCategory] = useToggle(false);

    // カテゴリーリストを更新
    const updateCategoryList = async (categoryType: CategoryType) => {
        const res = await getCategories(categoryType);
        res && setCategoryList(() => res?.data.categories);
    };

    // 小カテゴリーリストを更新
    const updateSmallCategoryList = async (bigCategoryId: number) => {
        // 大カテゴリーを取得
        const bigCategory = categoryList?.find(
            (bigCategory: BigCategory) => bigCategory.big_category_id == bigCategoryId
        );

        const smallCategoryList = bigCategory?.small_categories;
        smallCategoryList && setSmallCategoryList(() => smallCategoryList);
    };

    useEffect(() => {
        updateCategoryList(transaction.type);
    }, []);

    useEffect(() => {
        updateSmallCategoryList(transaction.big_category_id);
    }, [categoryList]);

    return (
        <>
            <CategoryTypeSelector updateCategoryList={updateCategoryList} />
            <div className="flex w-full gap-1 mt-2">
                <BigCategorySelector
                    categoryList={categoryList}
                    updateSmallCategoryList={updateSmallCategoryList}
                    toggleIsChangeBigCategory={toggleIsChangeBigCategory}
                />
                <SmallCategorySelector
                    smallCategoryList={smallCategoryList}
                    isChangeBigCategory={isChangeBigCategory}
                />
            </div>
        </>
    );
};

///////////////////////////////////////////////////////////////////////////////
// カテゴリータイプ
///////////////////////////////////////////////////////////////////////////////
const CategoryTypeSelector = (props: { updateCategoryList: (categoryType: CategoryType) => Promise<void> }) => {
    const { transaction, changeTransaction } = useTransactionContext();

    // カテゴリータイプ（支出 or 収入）を変更
    const changeCategoryType = async (event: React.MouseEvent<HTMLElement>, newCategoryType: "spending" | "income") => {
        changeTransaction("type", newCategoryType);
        props.updateCategoryList(newCategoryType);
    };

    return <ToggleButton toggleList={categoryTypeList} handler={changeCategoryType} value={transaction.type} />;
};

///////////////////////////////////////////////////////////////////////////////
// 大カテゴリー
///////////////////////////////////////////////////////////////////////////////
const BigCategorySelector = (props: {
    categoryList: BigCategory[] | undefined;
    updateSmallCategoryList: (bigCategoryId: number) => Promise<void>;
    toggleIsChangeBigCategory: () => void;
}) => {
    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();

    // 大カテゴリーを変更
    const changeBig = (newBigCategoryId: any) => {
        // 大カテゴリーを変更
        changeTransaction("big_category_id", newBigCategoryId);

        // 大カテゴリーに関連する小カテゴリーをセット
        props.updateSmallCategoryList(newBigCategoryId);

        // 小カテゴリーを未分類にリセットするためのトリガーを起動
        props.toggleIsChangeBigCategory();
    };

    // カテゴリーリスト未取得時はスケルトン表示
    if (!props.categoryList) {
        return <Skeleton variant="rounded" animation="wave" height={40} style={{ width: "100%" }} />;
    }

    return (
        <FormControl sx={{ m: 0, width: "100%" }} size="small">
            <InputLabel>大カテゴリー</InputLabel>
            <Select
                value={transaction.big_category_id}
                label="大カテゴリー"
                onChange={(e) => changeBig(Number(e.target.value))}
            >
                {props.categoryList.map((item: any, index: number) => {
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
const SmallCategorySelector = (props: {
    smallCategoryList: SmallCategory[] | undefined;
    isChangeBigCategory: boolean;
}) => {
    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();
    const changeSmall = (newSmallCategoryId: number) => changeTransaction("small_category_id", newSmallCategoryId);

    // 大カテゴリーが変更されたら、小カテゴリーを未分類にリセット
    useEffect(() => {
        if (props.smallCategoryList) {
            const smallCategoryFirstId = props.smallCategoryList[0].small_category_id;
            changeTransaction("small_category_id", smallCategoryFirstId);
        }
    }, [props.isChangeBigCategory]);

    // カテゴリーリスト未取得時はスケルトン表示
    if (props.smallCategoryList === undefined) {
        return <Skeleton variant="rounded" animation="wave" height={40} style={{ width: "100%" }} />;
    }

    return (
        <FormControl sx={{ m: 0, width: "100%" }} size="small">
            <InputLabel>小カテゴリー</InputLabel>
            <Select
                value={transaction.small_category_id}
                label="小カテゴリー"
                onChange={(e) => changeSmall(Number(e.target.value))}
                disabled={transaction.big_category_id === 1 ? true : false}
            >
                {props.smallCategoryList?.map((item: any, index: number) => {
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
