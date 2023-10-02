import { SelectorButton } from "@/src/components/inputs/select/SelectorButton";

interface MonthSelectorProps {
    month: number;
    setMonth: (month: number) => void;
}

export const MonthSelector = (props: MonthSelectorProps) => {
    const monthList = Array.from({ length: 12 }, (_, index) => {
        const value = index + 1;
        return { name: `${value}月`, value };
    });

    return (
        <SelectorButton
            selectedItem={props.month}
            handler={(e) => props.setMonth(Number(e.target.value))}
            itemList={monthList}
            label={"月"}
        />
    );
};
