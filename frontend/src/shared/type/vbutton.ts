export interface ISize { 
    small?: boolean,
    medium?: boolean,
    large?: boolean,
}

export interface IVariants {
    primary?: boolean,
    secondary?: boolean,
    danger?: boolean,
    success?: boolean,
}

export interface IDefaultPropsButton extends ISize, IVariants {
    prependIcon?: string,
    appendIcon?: string,
    loading?: boolean,
    disabled?: boolean,
    type?: 'button' | 'submit' | 'reset',
    fullWidth?: boolean,
    rounded?: boolean,
    outline?: boolean,
    text?: boolean,
}

export interface IButtonEvents {
    click: (event: Event) => void
    error: (error: unknown) => void
}