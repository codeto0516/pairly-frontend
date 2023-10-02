import { SelectorButton } from "@/src/components/inputs/select/SelectorButton";

interface YearSelectorProps {
    year: number;
    setYear: (year: number) => void;
}

export const YearSelector = (props: YearSelectorProps) => {
    const range_start = 2020;
    const range_end = new Date().getFullYear();

    const yeaerList = Array.from({ length: range_end - range_start + 1 }, (_, index) => {
        const value = range_start + index;
        return { name: `${value}年`, value };
    });

    return (
        <SelectorButton
            selectedItem={props.year}
            handler={(e) => props.setYear(Number(e.target.value))}
            itemList={yeaerList}
            label={"年"}
        />
    );
};
