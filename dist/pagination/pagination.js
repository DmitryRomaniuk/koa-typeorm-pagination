"use strict";
exports.__esModule = true;
exports.Pagination = void 0;
var Pagination = /** @class */ (function () {
    function Pagination(
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
    return Pagination;
}());
exports.Pagination = Pagination;
