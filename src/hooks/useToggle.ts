import { useCallback, useState } from "react";

export const useToggle = (initialValue = false) => {
    const [state, setState] = useState(initialValue);

    const toggle = useCallback((specificState?: boolean) => {
        if (specificState) {
            setState(() => specificState);
        } else {
            setState((prevState) => !prevState);
        }
    }, []);

    return [state, toggle] as const;
};
