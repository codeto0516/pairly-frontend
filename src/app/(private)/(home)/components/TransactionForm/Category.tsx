"use client";
import { FormControl, Skeleton } from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { SetStateAction, useEffect, useState } from "react";
import { useCategory } from "@/src/app/(private)/(home)/api/useCategory";
import { useTransactionContext } from "./main";
import { ToggleButton } from "@/src/components/inputs/button/ToggleButton";
import { useUpdateEffect } from "@/src/hooks/useUpdateEffect";

export interface BigCategory {
    bigCategoryId: number;
    bigCategoryName: string;
    smallCategories: SmallCategory[];
}

export interface SmallCategory {
    smallCategoryId: number;
    smallCategoryName: string;
}

export interface CategoryType {
    typeName: string;
    categories: BigCategory[];
}

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
    const { getCategoryAll } = useCategory();
    const { transaction } = useTransactionContext();

    const [categoryAll, setCategoryAll] = useState<CategoryType[] | undefined>(undefined);
    const [categoryList, setCategoryList] = useState<BigCategory[] | undefined>(undefined);

    const [smallCategoryList, setSmallCategoryList] = useState<SmallCategory[] | undefined>(undefined);

    const getCategoryList = (newCategoryType: string): BigCategory[] | undefined => {
        return categoryAll?.find((categoryList: any) => categoryList.typeName === newCategoryType)?.categories;
    };

    useEffect(() => {
        (async () => {
            const res = await getCategoryAll();
            const categoryTypes = res?.data.types
            categoryTypes && setCategoryAll(() => categoryTypes);
        })();
    }, []);

    useEffect(() => {
        const result = getCategoryList(transaction.type);

        // カテゴリーリストをセット
        result && setCategoryList(() => result);
    }, [categoryAll]);

    return (
        <>
            <CategoryTypeSelector
                categoryAll={categoryAll}
                setCategoryList={setCategoryList}
                getCategoryList={getCategoryList}
            />
            <div className="flex w-full gap-1 mt-2">
                <BigCategorySelector
                    categoryAll={categoryAll}
                    getCategoryList={getCategoryList}
                    setSmallCategoryList={setSmallCategoryList}
                />
                <SmallCategorySelector categoryList={categoryList} />
            </div>
        </>
    );
};

///////////////////////////////////////////////////////////////////////////////
// カテゴリータイプ
///////////////////////////////////////////////////////////////////////////////
const CategoryTypeSelector = (props: {
    categoryAll: CategoryType[] | undefined;
    setCategoryList: React.Dispatch<React.SetStateAction<BigCategory[] | undefined>>;
    getCategoryList: (newCategoryType: string) => BigCategory[] | undefined;
}) => {
    const { transaction, changeTransaction } = useTransactionContext();

    // カテゴリータイプ（支出 or 収入）を変更
    const changeCategoryType = async (event: React.MouseEvent<HTMLElement>, newCategoryType: string) => {
        if (newCategoryType === null) return;
        await changeTransaction("type", newCategoryType);
    };

    return <ToggleButton toggleList={categoryTypeList} handler={changeCategoryType} value={transaction.type} />;
};

///////////////////////////////////////////////////////////////////////////////
// 大カテゴリー
///////////////////////////////////////////////////////////////////////////////
const BigCategorySelector = (props: {
    categoryAll: CategoryType[] | undefined;
    getCategoryList: (newCategoryType: string) => BigCategory[] | undefined;
    setSmallCategoryList: React.Dispatch<SetStateAction<SmallCategory[] | undefined>>;
}) => {
    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();
    const [bigCategoryList, setBigCategoryList] = useState<BigCategory[] | undefined>(undefined);
    // 大カテゴリーを変更
    const changeBig = (newBigCategoryId: number) => changeTransaction("bigCategoryId", newBigCategoryId);

    const updateBigCategoryList = (newCategoryType: string) => {
        // 大カテゴリーを取得
        const bigCategoryList = props.categoryAll?.find(
            (categoryType: CategoryType) => categoryType.typeName == newCategoryType
        );
        // 大カテゴリーリストをセット
        bigCategoryList && setBigCategoryList(() => bigCategoryList.categories);
        return bigCategoryList;
    };

    // 大カテゴリーIDを未分類にリセット
    const resetBigCategory = (bigCategoryList: CategoryType | undefined) => {
        const bigCategoryFirstId = bigCategoryList?.categories[0].bigCategoryId;
        bigCategoryFirstId && changeBig(bigCategoryFirstId);
    };

    useUpdateEffect(() => {
        const bigCategoryList = updateBigCategoryList(transaction.type);
        resetBigCategory(bigCategoryList);
    }, [transaction.type]);

    useEffect(() => {
        if (transaction.type && props.categoryAll) {
            updateBigCategoryList(transaction.type);
        }
    }, [transaction.type, props.categoryAll]);

    if (props.categoryAll === undefined || bigCategoryList === undefined) {
        return <Skeleton variant="rounded" animation="wave" height={40} style={{ width: "100%" }} />;
    } else {
        return (
            <>
                <FormControl sx={{ m: 0, width: "100%" }} size="small">
                    <InputLabel>大カテゴリー</InputLabel>
                    <Select
                        value={transaction.bigCategoryId}
                        label="大カテゴリー"
                        onChange={(e) => changeBig(Number(e.target.value))}
                    >
                        {bigCategoryList?.map((item: any, index: number) => {
                            return (
                                <MenuItem key={index} value={item.bigCategoryId}>
                                    {item.bigCategoryName}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </>
        );
    }
};

///////////////////////////////////////////////////////////////////////////////
// 小カテゴリー
///////////////////////////////////////////////////////////////////////////////
const SmallCategorySelector = (props: { categoryList: BigCategory[] | undefined }) => {
    // 初回レンダリング => 大カテゴリーをもとに小カテゴリーリストをセットする
    // 大カテゴリーが変化したら小カテゴリーリストを更新し、小カテゴリーIDを初期値にリセットする

    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();
    const changeSmall = (newSmallCategoryId: number) => changeTransaction("smallCategoryId", newSmallCategoryId);
    const [smallCategoryList, setSmallCategoryList] = useState<SmallCategory[] | undefined>(undefined);

    const updateSmallCategoryList = (newBigCategoryId: number) => {
        // 大カテゴリーを取得
        const OneBigCategory = props.categoryList?.find(
            (bigCategory: BigCategory) => bigCategory.bigCategoryId == newBigCategoryId
        );
        // 小カテゴリーリストをセット
        const smallCategoryList = OneBigCategory?.smallCategories;
        smallCategoryList && setSmallCategoryList(() => smallCategoryList);
        return smallCategoryList;
    };

    const resetSmallCategory = (smallCategoryList: SmallCategory[] | undefined) => {
        // 小カテゴリーIDを未分類にリセット
        const smallCategoryFirstId = smallCategoryList?.[0].smallCategoryId;
        smallCategoryFirstId && changeSmall(smallCategoryFirstId);
    };

    useUpdateEffect(() => {
        const smallCategoryList = updateSmallCategoryList(transaction.bigCategoryId);
        // 小カテゴリーリストが変更されたら小カテゴリーIDを初期値にリセット
        resetSmallCategory(smallCategoryList);
    }, [transaction.bigCategoryId]);

    useEffect(() => {
        // 初回レンダリング時に小カテゴリーをセット
        if (transaction.bigCategoryId && props.categoryList) {
            updateSmallCategoryList(transaction.bigCategoryId);
        }
    }, [transaction.bigCategoryId, props.categoryList]);

    if (props.categoryList === undefined) {
        return <Skeleton variant="rounded" animation="wave" height={40} style={{ width: "100%" }} />;
    } else {
        return (
            <FormControl sx={{ m: 0, width: "100%" }} size="small">
                <InputLabel>小カテゴリー</InputLabel>
                <Select
                    value={transaction.smallCategoryId}
                    label="小カテゴリー"
                    onChange={(e) => changeSmall(Number(e.target.value))}
                    // disabled={transaction.bigCategoryId === 1 ? true : false}
                    // defaultValue={props.smallCategoryList[0].smallCategoryId}
                >
                    {smallCategoryList?.map((item: any, index: number) => {
                        return (
                            <MenuItem key={index} value={item.smallCategoryId}>
                                {item.smallCategoryName}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        );
    }
};
