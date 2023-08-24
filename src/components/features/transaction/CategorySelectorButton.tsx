"use client";
import { FormControl, Skeleton } from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useCallback, useEffect, useState } from "react";
// import { CategoryList } from "../../../datas/category";
import { useTransactionContext } from "@/src/components/features/transaction/TransactionForm";
import { useUserData } from "@/src/providers/SessionProvider";

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
    categoryList: any;
}

export const CategorySelectorButton = (): any => {
    return <BaseCategorySelectorButton />;
};

///////////////////////////////////////////////////////////////////////////////
// 本体
// 【機能】
// ①違う大カテゴリーを選択しなおしたら、小カテゴリーを未分類にリセットする
// ②大カテゴリーが選択されたら、それに関連する小カテゴリーに切り替える
// ③大カテゴリーが選択されていない時は、小カテゴリーを選択不可にする
///////////////////////////////////////////////////////////////////////////////
const BaseCategorySelectorButton = (): any => {
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
    }, []);

    // 取引データのコンテキスト
    const { transaction, changeTransaction } = useTransactionContext();

    /////////////////////////////////////////////////////////////
    // 大カテゴリー関連
    /////////////////////////////////////////////////////////////
    const [big, setBig] = useState<number>(transaction.big_category_id);

    // 大カテゴリーのイベントハンドラ
    const changeBig = useCallback((newBig: number) => {
        // 大カテゴリーIDを更新
        changeTransaction("big_category_id", newBig);
        setBig(() => newBig);

        // ①関連: 大カテゴリーが変更されたら小カテゴリーをリセット
        // changeSmall(1);
        // changeSmall(Number(smallList[0].small_category_id));
        changeSmall(smallList[0]?.small_category_id);

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
        console.log(categoryList);
        
        const result = categoryList?.find((item: any) => item.big_category_id == big);
        if (result) {
            setSmallList(() => result.small_categories);
            console.log(smallList[0]);

        }
    };

    useEffect(() => {
        console.log(big);
        
        updateSmallList(big);
    }, [big]);

    useEffect(() => {
        // console.log(big, small);
        
    }, [big, small]);

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
        categoryList,
    };

    return (
        <div className="flex w-full gap-1 mt-2">
            {categoryList ? (
                <>
                    <BigCategorySelector {...props} />
                    <SmallCategorySelector {...props} />
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
const BigCategorySelector = (props: Props) => {
    return (
        <BaseCategoryButton selectedId={props.big} eventHandler={props.changeBig} label={"大カテゴリー"}>
            {props.categoryList.map((item: any, index: number) => {
                return (
                    <MenuItem key={index} value={item.big_category_id}>
                        {item.big_category_name}
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
                        {props.big === 1 ? "未分類" : item.small_category_name}
                        {/* {item.small_category_name} */}
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
