import { useState } from "react";

export const useObject = <T extends object | null>(initialObject: T) => {
    const [object, setObject] = useState<T | null>(initialObject);

    const changeObject = (fieldOrNewObject: keyof T | T, value?: T[keyof T]) => {
        if (fieldOrNewObject === null) {
            setObject(null);
        } else if (typeof fieldOrNewObject === "object") {
            setObject(fieldOrNewObject);
        } else {
            setObject((prevObject) => ({
                ...((prevObject || {}) as T),
                [fieldOrNewObject]: value,
            }));
        }
    };

    return [object, changeObject] as const;
};
