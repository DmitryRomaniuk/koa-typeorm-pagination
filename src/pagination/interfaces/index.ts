export interface IPaginationOptions {
    /**
     * the amount of items to be requested per page
     */
    pageSize: number
    /**
     * the page that is requested
     */
    current: number
}

export interface IPaginationMeta {
    /**
     * the amount of items on this specific page
     */
    itemCount: number
    /**
     * the total amount of items
     */
    total: number
    /**
     * the amount of items that were requested per page
     */
    pageSize: number
    /**
     * the total amount of pages in this paginator
     */
    totalPages: number
    /**
     * the current page this paginator "points" to
     */
    current: number
}
