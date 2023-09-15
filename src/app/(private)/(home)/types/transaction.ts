export interface Amount {
    userId: string;
    amount: number;
}

export interface Transaction {
    id?: number;
    paidDate: string;
    type: string;
    bigCategoryId: number;
    smallCategoryId: number;
    content: string;
    createdBy: string;
    amounts: Amount[];
}
