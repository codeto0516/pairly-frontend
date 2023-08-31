// "use client";

import { SelectorButton } from "@/src/components/elements/form/SelectorButton";
import { perPageSelector } from "@/src/recoil/transactionListParams";
import { SelectChangeEvent } from "@mui/material";
import { useRecoilState } from "recoil";

const selectorItemList = [
    { name: "10件", value: 10 },
    { name: "20件", value: 20 },
    { name: "30件", value: 30 },
    { name: "40件", value: 40 },
    { name: "50件", value: 50 },
];

interface PerPageSelectorButton {
    perPage: number;
    changePerPage: (perPage: number) => void;
}

export const PerPageSelectorButton = () => {
    const [perPage, setPerPage] = useRecoilState<any>(perPageSelector);
    return (
        <SelectorButton
            selectedItem={perPage}
            handler={(e: SelectChangeEvent) => setPerPage(Number(e.target.value))}
            itemList={selectorItemList}
            label={"表示件数"}
        />
    );
};
