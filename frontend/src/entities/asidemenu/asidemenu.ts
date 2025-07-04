import { ref } from 'vue'

const isOpen = ref(false)

export const useAsideMenu = () => {
    const toggleAsideMenu = () => {
        isOpen.value = !isOpen.value
    }

    return {
        isOpen,
        toggleAsideMenu,
    }
}