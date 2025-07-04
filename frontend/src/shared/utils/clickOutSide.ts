import type { ObjectDirective } from "vue";

interface customElement extends HTMLElement {
    _onClickOutside?: (event: Event) => void
}

interface ClickOutsideBindingArgs {
    handler: (event: Event) => void;
    closeConditional?: (event: Event) => boolean;
    include?: () => HTMLElement[]
}

interface ClickOutsideDirective extends ObjectDirective {
    value?: ((e: Event) => void) | ClickOutsideBindingArgs;
}

function defaultCloseConditional(e: Event): boolean {
    return true
}

function directive(e: PointerEvent, el: HTMLElement, binding: ClickOutsideDirective) {
    const handler = typeof binding.value === 'function' ? binding.value : binding.value?.handler;

    const isActive = (typeof binding.value === 'object' && binding.value.closeConditional) || defaultCloseConditional

    if (!e || isActive(e) === false) return

    const elements = ((typeof binding.value === 'object' && binding.value.include) || (() => []))()

    elements.push(el)

    if (!elements.some(el => el.contains(e.target as Node))) {
        setTimeout(() => {
            handler?.(e)
        }, 0)
    }

}

export const VClickOutside = {
    mounted(el: customElement, binding: { value: () => void }) {
        const onClickOutside = (event: Event) => directive(event as PointerEvent, el, binding)
        // const app =  document.querySelector('#app') || document.body
        const app = document.body

        app.addEventListener('click', onClickOutside, true);

        el._onClickOutside = onClickOutside; 
    },

    unmounted(el: customElement) {
        if (!el._onClickOutside) return

        // const app = document.querySelector('#app') || document.body
        const app = document.body
        if (app) {
            app.removeEventListener('click', el._onClickOutside, true);
        }
        delete el._onClickOutside
    }
}