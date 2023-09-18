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

    const [bigCategoryList, setBigCategoryList] = useState<BigCategory[] | undefined>(undefined);
    const [smallCategoryList, setSmallCategoryList] = useState<SmallCategory[] | undefined>(undefined);

    const getBigCategoryList = (newCategoryType: string): BigCategory[] | undefined => {
        return categoryAll?.find((categoryList: any) => categoryList.typeName === newCategoryType)?.categories;
    };

    useEffect(() => {
        (async () => {
            const res = await getCategoryAll();
            const categoryTypes = res?.data.types;
            categoryTypes && setCategoryAll(() => categoryTypes);
        })();
    }, []);

    useEffect(() => {
        const result = getBigCategoryList(transaction.type);

        // カテゴリーリストをセット
        result && setBigCategoryList(() => result);
    }, [categoryAll]);

    return (
        <>
            <CategoryTypeSelector categoryAll={categoryAll} setBigCategoryList={setBigCategoryList} />
            <div className="flex w-full gap-1 mt-2">
                <BigCategorySelector bigCategoryList={bigCategoryList} setSmallCategoryList={setSmallCategoryList} />
                <SmallCategorySelector smallCategoryList={smallCategoryList} />
            </div>
        </>
    );
};

///////////////////////////////////////////////////////////////////////////////
// カテゴリータイプ
///////////////////////////////////////////////////////////////////////////////
const CategoryTypeSelector = (props: {
    categoryAll: CategoryType[] | undefined;
    setBigCategoryList: React.Dispatch<React.SetStateAction<BigCategory[] | undefined>>;
}) => {
    const { transaction, changeTransaction } = useTransactionContext();

    // カテゴリータイプ（支出 or 収入）を変更
    const changeCategoryType = (newCategoryType: string) => {
        changeTransaction("type", newCategoryType);

        const result = getBigCategoryList(newCategoryType);

        // カテゴリーリストをセット
        result && props.setBigCategoryList(() => result);
        
        const bigCategoryFirstId = result?.[0].bigCategoryId;
        

        // 大カテゴリーIDを未分類にリセット
        changeTransaction("bigCategoryId", bigCategoryFirstId);

        // 小カテゴリーIDを未分類にリセット
        changeTransaction("smallCategoryId", result?.[0].smallCategories[0].smallCategoryId);
    };

    const getBigCategoryList = (newCategoryType: string): BigCategory[] | undefined => { 
        return props.categoryAll?.find((categoryList: any) => categoryList.typeName === newCategoryType)?.categories;
    }

    useEffect(() => {
        if (props.categoryAll) {
            const result = getBigCategoryList(transaction.type);
            result && props.setBigCategoryList(() => result);
        }
    }, [props.categoryAll, transaction.type]);

    return <ToggleButton toggleList={categoryTypeList} handler={changeCategoryType} value={transaction.type} />;
};

///////////////////////////////////////////////////////////////////////////////
// 大カテゴリー
///////////////////////////////////////////////////////////////////////////////
const BigCategorySelector = (props: {
    bigCategoryList: BigCategory[] | undefined;
    setSmallCategoryList: React.Dispatch<React.SetStateAction<SmallCategory[] | undefined>>;
}) => {
    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();
    // 大カテゴリーを変更
    const changeBig = (newBigCategoryId: number) => {
        changeTransaction("bigCategoryId", newBigCategoryId);

        const oneBigCategory = getOneBigCategory(newBigCategoryId);
        oneBigCategory && updateSmallCategoryList(oneBigCategory);

        // 小カテゴリーIDを未分類にリセット
        changeTransaction("smallCategoryId", oneBigCategory?.smallCategories[0].smallCategoryId);

        // 大カテゴリーIDを未分類にリセット
        changeTransaction("bigCategoryId", oneBigCategory?.bigCategoryId);
    };

    const getOneBigCategory = (newBigCategoryId: number): BigCategory | undefined => {
        return props.bigCategoryList?.find((item) => item.bigCategoryId === newBigCategoryId);
    };

    const updateSmallCategoryList = (OnebigCategory: BigCategory) => {
        props.setSmallCategoryList(() => OnebigCategory.smallCategories);
    };

    useEffect(() => {
        if (props.bigCategoryList) {
            const oneBigCategory = getOneBigCategory(transaction.bigCategoryId);
            oneBigCategory && updateSmallCategoryList(oneBigCategory);
        }
    }, [props.bigCategoryList, transaction.bigCategoryId]);

    if (props.bigCategoryList === undefined) {
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
                        {props.bigCategoryList?.map((item: any, index: number) => {
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
const SmallCategorySelector = (props: { smallCategoryList: SmallCategory[] | undefined }) => {
    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();
    const changeSmall = (newSmallCategoryId: number) => changeTransaction("smallCategoryId", newSmallCategoryId);

    if (props.smallCategoryList === undefined) {
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
                >
                    {props.smallCategoryList?.map((item: any, index: number) => {
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
