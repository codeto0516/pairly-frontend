import { useState } from "react";

export const useArray = <T>() => {
    const [array, setArray] = useState<Array<T>>([]);

    const changeArray = (index: number, value: T) => {
        setArray((prevArray) => {
            const newArray = [...prevArray];
            newArray[index] = value;
            return newArray;
        });
    };

    return [array, changeArray] as const;
};
