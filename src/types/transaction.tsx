
export interface Amount {
    user_id: number;
    amount: number;
}

export interface TransactionType {
    id?: number;
    paid_date: string;
    type: string;
    big_category_id: number;
    small_category_id: number;
    content: string;
    created_by: number;
    amounts: Amount[];
}

export interface TransactionListType {
    date: string;
    transactions: TransactionType[];
}
