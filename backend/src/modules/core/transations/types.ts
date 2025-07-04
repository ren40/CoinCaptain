export interface ITransation {
    id: number,
    date: string,
    description: string,
    amount: number,
    categoryId?: number,
    isIncome: boolean,
    balance: number,
    createdAt: string,
}

export type ITransationScheme = Omit<ITransation, 'id' | 'createdAt'>

export const ITransationKeys = ['id', 'date', 'description', 'amount', 'categoryId', 'isIncome', 'balance', 'createdAt'];


export interface ICategory {
    id: number,
    name: string,
    userId?: number,
}

export type ICategoryScheme = Omit<ICategory, 'id'>
export const ICategoryKeys = ['id', 'name', 'userId']


