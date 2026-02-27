export interface ITransactions {
    id: number,
    date: string,
    description: string,
    amount: number,
    categoryId?: number,
    isIncome: boolean,
    balance: number,
    createdAt: string,
}

export type ITransactionCreate = Omit<ITransactions, 'id' | 'createdAt' | 'balance'>;