"use client";
import { FormControl } from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useCallback, useEffect, useState } from "react";
import { CategoryList } from "../../../datas/category";
import { useTransactionContext } from "@/src/components/features/transaction/TransactionForm";

interface BigCategory {
    big_category_id: number;
    big_category: string;
}

interface SmallCategory {
    small_category_id: number;
    small_category: string;
}

interface Props {
    isDisable: boolean;
    big: number;
    small: number;
    changeBig: (newBig: number) => void;
    changeSmall: (newSmall: number) => void;
    smallList: SmallCategory[];
}

///////////////////////////////////////////////////////////////////////////////
// 本体
///////////////////////////////////////////////////////////////////////////////
export const CategorySelectorButton = (): any => {
    // 【機能】
    // ①違う大カテゴリーを選択しなおしたら、小カテゴリーを未分類にリセットする
    // ②大カテゴリーが選択されたら、それに関連する小カテゴリーに切り替える
    // ③大カテゴリーが選択されていない時は、小カテゴリーを選択不可にする

    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();

    /////////////////////////////////////////////////////////////
    // 大カテゴリー関連
    /////////////////////////////////////////////////////////////
    const [big, setBig] = useState<number>(transaction.big_category_id);

    // 大カテゴリーのイベントハンドラ
    const changeBig = useCallback((newBig: number) => {
        // 大カテゴリーIDを更新
        changeTransaction("big_category_id", newBig); // グローバル
        setBig(() => newBig); // ローカル

        // ①関連: 大カテゴリーが変更されたら小カテゴリーをリセット
        changeSmall(1);

        // ②関連: 選択された大カテゴリーに関する小カテゴリーリストをセット
        updateSmallList(big);

        // ③関連: もし大カテゴリーで未分類が選択されたら、小カテゴリーを選択不可にする
        newBig === 1 ? setIsDisable(() => true) : setIsDisable(() => false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /////////////////////////////////////////////////////////////
    // 小カテゴリー関連
    /////////////////////////////////////////////////////////////
    const [small, setSmall] = useState<number>(transaction.small_category_id);

    // ③関連: 大カテゴリーが未入力の場合は小カテゴリーを選択不可にする
    const [isDisable, setIsDisable] = useState<boolean>(true);

    // 小カテゴリーのイベントハンドラ
    const changeSmall = (newSmall: number) => {
        // 小カテゴリーIDを更新（グローバルとローカルを同じ状態にする）
        changeTransaction("small_category_id", newSmall);
        setSmall(() => newSmall);
    };

    // ②関連: 大カテゴリーを選択した場合の、関連する小カテゴリーを入れる
    const [smallList, setSmallList] = useState<SmallCategory[]>([]);
    const updateSmallList = (big: number) => {
        const result = CategoryList.find((item) => item.big_category_id == big);
        if (result) {
            setSmallList(result.small_categories);
        }
    };

    useEffect(() => {
        updateSmallList(big);
    }, [big]);

    /////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////

    // 大カテゴリーと小カテゴリーのコンポーネントに渡すもの
    const props = {
        isDisable,
        big,
        small,
        changeBig,
        changeSmall,
        smallList,
    };

    return (
        <div className="flex w-full gap-1 mt-2">
            {/* 大カテゴリー */}
            <BigCategorySelector {...props} />

            {/* 小カテゴリー */}
            <SmallCategorySelector {...props} />
        </div>
    );
};

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////
const BigCategorySelector = (props: Props) => {
    return (
        <BaseCategoryButton selectedId={props.big} eventHandler={props.changeBig} label={"大カテゴリー"}>
            {CategoryList.map((item: any, index: number) => {
                return (
                    <MenuItem key={index} value={item.big_category_id}>
                        {item.big_category}
                    </MenuItem>
                );
            })}
        </BaseCategoryButton>
    );
};

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////
const SmallCategorySelector = (props: Props) => {
    return (
        <BaseCategoryButton
            selectedId={props.small}
            eventHandler={props.changeSmall}
            label={"小カテゴリー"}
            disabled={props.big === 1 ? true : false}
        >
            {props.smallList.map((item: any, index: number) => {
                return (
                    <MenuItem key={index} value={item.small_category_id}>
                        {item.small_category}
                    </MenuItem>
                );
            })}
        </BaseCategoryButton>
    );
};

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////
const BaseCategoryButton = (props: {
    selectedId?: number;
    eventHandler?: any;
    label?: string;
    labelId?: string;
    children?: React.ReactNode;
    disabled?: boolean;
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
                disabled={props.disabled}
            >
                {props.children}
            </Select>
        </FormControl>
    );
};
