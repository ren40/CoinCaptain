export const saveLocalStorage = async (key: string, value: unknown) => {
    try {
        let tmpValue = ''
        if (typeof value === 'object') {
            tmpValue = JSON.stringify(value)
        } else {
            tmpValue = value as string
        }
        await localStorage.setItem(key, tmpValue)
    } catch (e: unknown) {
        throw new Error('Error save local storage')
    }

}

export const getValueFromLocalStorage = async (key: string) => {
    try {
        return await localStorage.getItem(key)
    } catch {
        throw new Error('Error get value from local storage')
    }
} 