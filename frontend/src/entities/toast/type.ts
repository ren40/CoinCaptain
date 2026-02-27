export interface IToast {
    id: number
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration: number
    autoRemove?: boolean,
    close?: boolean,
}

export interface IToastItemProps {
    toast: IToast,
}

export type createIToast = Omit<IToast, 'id'>
