export interface ICategory {
    id: string;
    name: string;
    color?: string;
}

export type ICategoryCreate = Omit<ICategory, 'id'>