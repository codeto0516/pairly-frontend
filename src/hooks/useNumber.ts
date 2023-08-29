import { useState } from "react";

export const useNumber = (initialNumber: number) => {
    const [number, setNumber] = useState<number>(initialNumber);
    const changeNumber = (newNumber: number) => {
        setNumber(() => newNumber);
    };

    return [number, changeNumber] as const;
};
