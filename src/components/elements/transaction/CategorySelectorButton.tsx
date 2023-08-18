"use client";
import { FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Children, ReactNode, useCallback, useEffect, useState } from "react";
import { CategoryList } from "../../../testdatas/category";
import { useTransactionContext } from "@/src/app/(main)/report/TransactionForm";

interface SmallCategoryType {
    small_category_id: number;
    small_category: string;
}

interface CategorySelectorButtonType {
    bigCategoryId?: number;
    smallCategoryId?: number;
    handleChangeBigCategory: (newBigCategoryId: number) => void;
    handleChangeSmallCategory: (newSmallCategoryId: number) => void;
}
/* -----------------------------------------------------------------------
 カスタム
----------------------------------------------------------------------- */
const CustomCategoryButton = (props: {
    selectedId?: number;
    eventHandler?: any;
    label?: string;
    labelId?: string;
    children?: React.ReactNode;
    // disabled?: boolean;
}) => {
    return (
        <FormControl sx={{ m: 0, width: "100%" }} size="small">
            <InputLabel id={props.labelId}>{props.label}</InputLabel>
            <Select
                labelId={props.labelId}
                id={props.labelId}
                value={props.selectedId}
                label={props.label}
                onChange={(e) => props.eventHandler(Number(e.target.value))}
                // disabled={props.disabled}
            >
                {props.children}
            </Select>
        </FormControl>
    );
};

/* -----------------------------------------------------------------------
 本体
----------------------------------------------------------------------- */
export const CategorySelectorButton = () => {
    // ・大カテゴリーが選択されていない時は、小カテゴリーを選択不可にする
    // ・違う大カテゴリーを選択しなおしたら、小カテゴリーを未分類にリセットする
    // ・大カテゴリーが選択されたら、それに関連する小カテゴリーに切り替える

    const { transaction, changeTransaction } = useTransactionContext();

    const [bigCategoryId, setBigCategoryId] = useState(transaction.big_category_id);
    const [smallCategoryId, setSmallCategoryId] = useState(transaction.small_category_id);

    // 大カテゴリーのイベントハンドラ
    const changeBigCategory = (newBigCategoryId: Number) => {
        if (newBigCategoryId != transaction.big_category_id) {
            changeTransaction("small_category_id", 1);
            setSmallCategoryId(1);
        }
        changeTransaction("big_category_id", newBigCategoryId);
        setBigCategoryId(newBigCategoryId);
    };
    // 小カテゴリーのイベントハンドラ
    const changeSmallCategory = (newSmallCategoryId: Number) => {
        changeTransaction("small_category_id", newSmallCategoryId);
        setSmallCategoryId(newSmallCategoryId);
    };


    // 大カテゴリーが未入力の場合は小カテゴリーを選択不可にする
    const [isDisable, setIsDisable] = useState<boolean>(true);

    // 大カテゴリーを選択した場合の、関連する小カテゴリーを入れる
    const [smallCategoryList, setSmallCategoryList] = useState<SmallCategoryType[]>([]);
    const setSmallCategory = (bigCategoryId: number) => {

        const result = CategoryList.find((item) => item.big_category_id == bigCategoryId);
        if (result) {
            setSmallCategoryList(result.small_categories);
        }
    };

    useEffect(() => {
        // 選択した大カテゴリーに関連する小カテゴリーをsmallCategoryListにセットする
        setSmallCategory(bigCategoryId);

        if (bigCategoryId == 1) {
            // 大カテゴリーで未分類を選択したら、小カテゴリーも自動的に未分類にリセットする
            changeSmallCategory(1);
            // 小カテゴリーを選択不可にする
            setIsDisable(true);
        } else {
            // 小カテゴリーを選択可にする
            setIsDisable(false);
        }
    }, [bigCategoryId]);

    return (
        <div className="flex w-full gap-1 mt-2">
            {/* 大カテゴリー */}
            <CustomCategoryButton selectedId={bigCategoryId} eventHandler={changeBigCategory} label={"大カテゴリー"}>
                {CategoryList.map((item: any, index: number) => {
                    return (
                        <MenuItem key={index} value={item.big_category_id}>
                            {item.big_category}
                        </MenuItem>
                    );
                })}
            </CustomCategoryButton>

            {/* 小カテゴリー */}
            <CustomCategoryButton
                selectedId={smallCategoryId}
                eventHandler={changeSmallCategory}
                label={"小カテゴリー"}
                // disabled={isDisable}
            >
                {smallCategoryList.map((item: any, index: number) => {
                    return (
                        <MenuItem key={index} value={item.small_category_id}>
                            {item.small_category}
                        </MenuItem>
                    );
                })}
            </CustomCategoryButton>
        </div>
    );
};
