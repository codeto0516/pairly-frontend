import { useRecoilState, useRecoilValue } from "recoil";

import { SelectorButton } from "@/src/components/inputs/select/SelectorButton";
import { monthSelector, yearSelector } from "../../stores/transactionListParams";

// 年と月のセレクター
export const YearMonthSelectorButton = () => {
    return (
        <div className="flex gap-2">
            <YearSelector />
            <MonthSelector />
        </div>
    );
};


const YearSelector = () => {
    const [year, setYear] = useRecoilState(yearSelector);

    const range_start = 2020;
    const range_end = new Date().getFullYear();

    const yeaerList = Array.from({ length: range_end - range_start + 1 }, (_, index) => {
        const value = range_start + index; 
        return { name: `${value}年`, value };
    });

    return (
        <SelectorButton
            selectedItem={year}
            handler={(e) => setYear(Number(e.target.value))}
            itemList={yeaerList}
            label={"年"}
        />
    );
};

const MonthSelector = () => { 
    const [month, setMonth] = useRecoilState(monthSelector);

    const monthList = Array.from({ length: 12 }, (_, index) => {
        const value = index + 1;
        return { name: `${value}月`, value };
    });

    return (
        <SelectorButton
            selectedItem={month}
            handler={(e) => setMonth(Number(e.target.value))}
            itemList={monthList}
            label={"月"}
        />
    );
}