export interface ICategory {
    id: string;
    name: string;
}

export type ICategoryCreate = Omit<ICategory, 'id'>