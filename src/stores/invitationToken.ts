import { atom } from "recoil";
export type InvitationToken = string | undefined;
export const invitationTokenState = atom<InvitationToken>({
    key: "invitationTokenState",
    default: undefined, // 初期値は空のリスト
});
