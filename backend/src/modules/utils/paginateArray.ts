export const paginate = (arr: unknown[], currentPage: number, sizePage: number) => {
    return arr.slice(currentPage * sizePage, currentPage * sizePage + sizePage)
}