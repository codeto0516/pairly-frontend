"use client";
import { FormControl, Skeleton } from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { SetStateAction, useEffect, useState } from "react";
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

export interface CategoryType {
    type_name: string;
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
    const { transaction, changeTransaction } = useTransactionContext();

    const [categoryAll, setCategoryAll] = useState<CategoryType[] | undefined>(undefined);
    const [categoryList, setCategoryList] = useState<BigCategory[] | undefined>(undefined);

    const [smallCategoryList, setSmallCategoryList] = useState<SmallCategory[] | undefined>(undefined);

    const getCategoryList = (newCategoryType: string): BigCategory[] | undefined => {
        return categoryAll?.find((categoryList: any) => categoryList.type_name === newCategoryType)?.categories;
    };

    useEffect(() => {
        (async () => {
            const res = await getCategoryAll();
            res && setCategoryAll(() => res?.data.types);
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
                {categoryAll ? (
                    <>
                        <BigCategorySelector
                            categoryList={categoryList}
                            getCategoryList={getCategoryList}
                            setSmallCategoryList={setSmallCategoryList}
                        />
                        <SmallCategorySelector smallCategoryList={smallCategoryList} />
                    </>
                ) : (
                    <>
                        <Skeleton variant="rounded" animation="wave" height={40} style={{ width: "100%" }} />
                        <Skeleton variant="rounded" animation="wave" height={40} style={{ width: "100%" }} />
                    </>
                )}
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

    const updateCategoryList = (newCategoryType: string) => {
        // カテゴリータイプからリストを検索し取得
        const result = props.getCategoryList(newCategoryType);

        props.setCategoryList(() => result);

        // 大カテゴリーIDを未分類にリセット
        const bigCategoryFirstId = result?.[0].big_category_id;
        changeTransaction("big_category_id", bigCategoryFirstId);

        // 小カテゴリーIDを未分類にリセット
        const smallCategoryFirstId = result?.[0].small_categories[0].small_category_id;
        changeTransaction("small_category_id", smallCategoryFirstId);
    };

    // カテゴリータイプ（支出 or 収入）を変更
    const changeCategoryType = async (event: React.MouseEvent<HTMLElement>, newCategoryType: string) => {
        if (newCategoryType === null) return;

        await changeTransaction("type", newCategoryType);
        updateCategoryList(newCategoryType);
    };

    return <ToggleButton toggleList={categoryTypeList} handler={changeCategoryType} value={transaction.type} />;
};

///////////////////////////////////////////////////////////////////////////////
// 大カテゴリー
///////////////////////////////////////////////////////////////////////////////
const BigCategorySelector = (props: {
    categoryList: BigCategory[] | undefined;
    getCategoryList: (newCategoryType: string) => BigCategory[] | undefined;
    setSmallCategoryList: React.Dispatch<SetStateAction<SmallCategory[] | undefined>>;
}) => {
    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();

    // 小カテゴリーリストを更新
    const updateSmallCategoryList = (newBigCategoryId: number) => {
        // 大カテゴリーを取得
        const bigCategory = props.categoryList?.find(
            (bigCategory: BigCategory) => bigCategory.big_category_id == newBigCategoryId
        );

        // 大カテゴリーに関連する小カテゴリーをセット
        const smallCategoryList = bigCategory?.small_categories;
        smallCategoryList && props.setSmallCategoryList(() => smallCategoryList);
        return smallCategoryList;
    };

    // 大カテゴリーを変更
    const changeBig = (newBigCategoryId: number) => {
        // 大カテゴリーを変更
        changeTransaction("big_category_id", newBigCategoryId);

        // 大カテゴリーに関連する小カテゴリーをセット
        const smallCategoryList = updateSmallCategoryList(newBigCategoryId);

        // 小カテゴリーIDを未分類にリセット
        const smallCategoryFirstId = smallCategoryList?.[0].small_category_id;
        changeTransaction("small_category_id", smallCategoryFirstId);
    };

    useEffect(() => {
        props.categoryList && updateSmallCategoryList(transaction.big_category_id);
    }, [props.categoryList]);

    return (
        <>
            <FormControl sx={{ m: 0, width: "100%" }} size="small">
                <InputLabel>大カテゴリー</InputLabel>
                <Select
                    value={transaction.big_category_id}
                    label="大カテゴリー"
                    onChange={(e) => changeBig(Number(e.target.value))}
                >
                    {props.categoryList?.map((item: any, index: number) => {
                        return (
                            <MenuItem key={index} value={item.big_category_id}>
                                {item.big_category_name}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </>
    );
};

///////////////////////////////////////////////////////////////////////////////
// 小カテゴリー
///////////////////////////////////////////////////////////////////////////////
const SmallCategorySelector = (props: { smallCategoryList: SmallCategory[] | undefined }) => {
    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();
    const changeSmall = (newSmallCategoryId: number) => changeTransaction("small_category_id", newSmallCategoryId);

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
