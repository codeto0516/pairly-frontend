import { atom, selector, useRecoilState, RecoilState } from "recoil";

export interface TransactionListParams {
    page: number;
    perPage: number;
    count: number;
    isClickButton: boolean;
}

export const transactionListParamsState = atom<TransactionListParams>({
    key: "transactionListParamsState",
    default: {
        page: 1,
        perPage: 10,
        count: 1,
        isClickButton: false,
    },
});

type FieldToUpdate = "page" | "perPage" | "count" | "isClickButton";

function createFieldUpdateSelector(fieldName: FieldToUpdate) {
    return selector({
        key: `set${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}Selector`,
        get: ({ get }) => {
            const fieldValue = get(transactionListParamsState)[fieldName];
            return fieldValue;
        },
        set: ({ set }, newValue) => {
            set(transactionListParamsState, (prevParams:any) => ({
                ...prevParams,
                [fieldName]: newValue,
            }));
        },
    });
}

export const pageSelector = createFieldUpdateSelector("page") as RecoilState<number>;
export const perPageSelector = createFieldUpdateSelector("perPage") as RecoilState<number>;
export const countSelector = createFieldUpdateSelector("count") as RecoilState<number>;
export const isButtonClickSelector = createFieldUpdateSelector("isClickButton") as RecoilState<boolean>;
