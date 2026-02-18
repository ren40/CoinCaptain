export interface IBudget {
    id: number;
    userId: number;
    amount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
    isActive: boolean;
    startBalance: number;
    createdAt: string;
    updatedAt: string;
}

export type IBudgetCreate = Omit<IBudget, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export type IBudgetUpdate = Partial<IBudgetCreate>;

export interface IBudgetStats {
    budgetAmount: number;
    spentAmount: number;
    remainingAmount: number;
    spentPercentage: number;
    period: 'weekly' | 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
    startBalance: number;
}
