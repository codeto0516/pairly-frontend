"use client";
import { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { SelectorButton } from "@/src/components/elements/form/SelectorButton";


const selectorItemList = [
    { name: "10件", value: 10 },
    { name: "20件", value: 20 },
    { name: "30件", value: 30 },
    { name: "40件", value: 40 },
    { name: "50件", value: 50 },
];

export const DisplayNumberSelectorButton = () => {
    const [displayNum, setDisplayNum] = useState<number>(10);

    const handleChange = (event: SelectChangeEvent) => {
        setDisplayNum(Number(event.target.value));
    };

    return (
        <SelectorButton selectedItem={displayNum} handler={handleChange} itemList={selectorItemList} label={"表示件数"} />
    );
};
 