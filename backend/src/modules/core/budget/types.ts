export interface IBudget {
    id: number,
    userId: number,
    amount: number,
    period: 'weekly' | 'monthly' | 'yearly',
    startDate: string,
    endDate: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
}

export type IBudgetScheme = Omit<IBudget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>

export type IBudgetUpdateScheme = Partial<IBudgetScheme>

export const IBudgetKeys = ['id', 'userId', 'amount', 'period', 'startDate', 'endDate', 'isActive', 'createdAt', 'updatedAt']

export interface IBudgetStats {
    budgetAmount: number,
    spentAmount: number,
    remainingAmount: number,
    spentPercentage: number,
    period: 'weekly' | 'monthly' | 'yearly',
    startDate: string,
    endDate: string,
} 