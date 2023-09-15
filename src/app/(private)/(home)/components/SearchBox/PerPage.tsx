import { useRecoilState, useRecoilValue } from "recoil";
import { perPageSelector, totalSelector } from "../../stores/transactionListParams";
import { SelectorButton } from "@/src/components/inputs/select/SelectorButton";

export const PerPageSelectorButton = () => {
    const split = 10;
    const total = useRecoilValue<number>(totalSelector);
    const selectorItemList = Array.from({ length: Math.ceil(total / split) }, (_, index) => {
        const value = (index + 1) * split; // 値は1からtotalまでの連番

        if (value < total) {
            return { name: `${value}件`, value };
        } else {
            return { name: `全て(${total}件)`, value };
        }
    });

    const [perPage, setPerPage] = useRecoilState(perPageSelector);

    return (
        <SelectorButton
            selectedItem={perPage}
            handler={(e) => setPerPage(Number(e.target.value))}
            itemList={selectorItemList.length === 0 ? [{ name: "10件", value: 10 }] : selectorItemList}
            label={"表示件数"}
        />
    );
};
