import { IPaginationMeta } from './interfaces';
export declare class Pagination<PaginationObject> {
    /**
     * a list of items to be returned
     */
    readonly content: PaginationObject[];
    /**
     * associated meta information (e.g., counts)
     */
    readonly pagination: IPaginationMeta;
    constructor(
    /**
     * a list of items to be returned
     */
    content: PaginationObject[], 
    /**
     * associated meta information (e.g., counts)
     */
    pagination: IPaginationMeta);
}
