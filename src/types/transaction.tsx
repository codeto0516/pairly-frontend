
export interface TransactionType {
    id?: number;
    date: string;
    type: string;
    big_category_id: number;
    small_category_id: number;
    content: string;
    total_amount?: number;
    user: string;
    description: {
        user: string;
        amount: number;
    }[];
}

export interface TransactionListType {
    date: string;
    transactions: TransactionType[];
}
