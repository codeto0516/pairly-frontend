import { useState } from "react";

export const useObject = <T extends object>(initialObject: T) => {
    const [object, setObject] = useState<T>(initialObject);

    const changeObject = (field: keyof T, value: T[keyof T]) => {
        setObject((prevObject) => ({
            ...prevObject,
            [field]: value,
        }));
    };

    return [object, changeObject] as const;
};
