import { useCallback, useState } from "react";

export const useToggle = (initialValue = false) => {
    const [state, setState] = useState(initialValue);

    const toggle = useCallback((specificState?: boolean) => {
        if (specificState === undefined) {
            setState((prevState) => !prevState);
        } else {
            setState(() => specificState);
        }
    }, []);

    return [state, toggle] as const;
};
