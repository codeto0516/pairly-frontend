import { atom } from "recoil";
import { selector, useRecoilState } from "recoil";

export const userState = atom<any>({
    key: "transactionState",
    default: null,
});


export const userSelector = selector({
    key: "userSelector", // 一意のキー
    get: ({ get }) => {
        // userStateからログインユーザー情報を取得
        const user = get(userState);
        return user;
    },
    set: ({ set }, newUser) => {
        // userStateを更新してログインユーザー情報を変更
        set(userState, newUser);
    },
});
