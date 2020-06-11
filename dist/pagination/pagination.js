"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
class Pagination {
    constructor(
    /**
     * a list of items to be returned
     */
    items, 
    /**
     * associated meta information (e.g., counts)
     */
    meta) {
        this.items = items;
        this.meta = meta;
    }
}
exports.Pagination = Pagination;
