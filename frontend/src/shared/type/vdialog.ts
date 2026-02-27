import type { InjectionKey } from 'vue'

export interface IVDialogInject {
    open: () => void;
    close: () => void;
    isOpen: () => boolean;
}

export const vDialogKeyInject = Symbol() as InjectionKey<IVDialogInject>
