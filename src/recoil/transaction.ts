import { atom } from "recoil";

export const transactionState = atom<boolean>({
    key: "transactionState",
    default: false,
});
