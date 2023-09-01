import { RecoilState, atom } from "recoil";
import { selector, useRecoilState } from "recoil";

interface User {
    id: number | null;
    name: string | null;
    email: string | null;
    image: string | null;
    idToken: string | null;
}

export const userState = atom<any>({
    key: "userState",
    default: {},
});
