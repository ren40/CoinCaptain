export interface IBalance {
    id: number
    balanceDate: string
    balanceAmount: number
    userId: number
}

export const BalanceKeys = ['id', 'balanceDate', 'balanceAmount', 'userId'] as const
