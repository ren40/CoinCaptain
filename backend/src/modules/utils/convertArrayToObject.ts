export const convertArrayToObject = <T>(array: unknown[], keys: string[]): Record<string, T> => {
    if (!Array.isArray(array)) {
        throw new Error('Input must be an array');
    }
    let object:  Record<string, T> = {};

    for (let ind = 0; ind < array.length; ind++) {
        object[keys[ind]] = array[ind] as T;
    }
    return object;
}