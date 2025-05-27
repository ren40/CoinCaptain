export interface ITransation {
    id: number,
    date: string,
    description: string,
    amount: number,
    categoryId: number,
    isIncome: boolean,
    balance: number,
    createdAt: string,
}