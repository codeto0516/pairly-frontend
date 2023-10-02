import { useRecoilState, useRecoilValue } from "recoil";
import { perPageSelector, totalSelector } from "../../stores/transactionListParams";
import { SelectorButton } from "@/src/components/inputs/select/SelectorButton";

interface PerPageSelectorProps {
    total: number | null;
    perPage: number;
    setPerPage: (perPage: number) => void;
}

export const PerPageSelector = (props: PerPageSelectorProps) => {
    const PER_PAGE_SPLIT = 10;

    if (props.total === null) {
        return (
            <SelectorButton
                selectedItem={10}
                handler={(e) => props.setPerPage(Number(e.target.value))}
                itemList={[{ name: "10件", value: 10 }]}
                label={"表示件数"}
            />
        );
    }

    const selectorItemList = Array.from({ length: Math.ceil(props.total / PER_PAGE_SPLIT) }, (_, index) => {
        const value = (index + 1) * PER_PAGE_SPLIT; // 値は1からtotalまでの連番

        if (props.total && value < props.total) {
            return { name: `${value}件`, value };
        } else {
            return { name: `全て(${props.total}件)`, value };
        }
    });

    return (
        <SelectorButton
            selectedItem={props.perPage}
            handler={(e) => props.setPerPage(Number(e.target.value))}
            itemList={selectorItemList.length === 0 ? [{ name: "10件", value: 10 }] : selectorItemList}
            label={"表示件数"}
        />
    );
};
