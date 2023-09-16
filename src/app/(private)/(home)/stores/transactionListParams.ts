import { atom, selector, useRecoilState, RecoilState } from "recoil";

export interface TransactionListParams {
    page: number;
    perPage: number;
    count: number;
    total: number | null;
    year: number;
    month: number;
    keyword?: string;
}

export const transactionListParamsState = atom<TransactionListParams>({
    key: "transactionListParamsState",
    default: {
        page: 1,
        perPage: 10,
        count: 1,
        total: null,
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        keyword: "",
    },
});

type FieldToUpdate = "page" | "perPage" | "count" | "total" | "year" | "month" | "keyword";

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
export const totalSelector = createFieldUpdateSelector("total") as RecoilState<number>; 
export const yearSelector = createFieldUpdateSelector("year") as RecoilState<number>;
export const monthSelector = createFieldUpdateSelector("month") as RecoilState<number>;
export const keywordSelector = createFieldUpdateSelector("keyword") as RecoilState<string>;