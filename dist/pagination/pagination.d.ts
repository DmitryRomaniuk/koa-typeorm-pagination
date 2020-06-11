import { IPaginationMeta } from './interfaces';
export declare class Pagination<PaginationObject> {
    /**
     * a list of items to be returned
     */
    readonly items: PaginationObject[];
    /**
     * associated meta information (e.g., counts)
     */
    readonly meta: IPaginationMeta;
    constructor(
    /**
     * a list of items to be returned
     */
    items: PaginationObject[], 
    /**
     * associated meta information (e.g., counts)
     */
    meta: IPaginationMeta);
}
