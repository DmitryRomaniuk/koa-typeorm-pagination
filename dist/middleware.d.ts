import type { Context } from 'koa';
/**
 * Base Class for error types thrown by Koa Paginate.
 *
 * @param message The human-readable message describing the error
 */
export declare class KoaPageableError extends Error {
    /**
     * HTTP Status code to be returned, 400
     */
    static status: number;
    /**
     * Stack trace obtained via Error().stack
     */
    stack?: string;
    /**
     * Human readable description of error
     */
    message: string;
    /**
     * Name of the error
     * @param message
     */
    name: string;
    constructor(message: string);
}
/**
 * Error type thrown when parsing Pagination parameters fails
 * @param message The human-readable message describing the error
 */
export declare class NumberFormatError extends KoaPageableError {
    static status: number;
    constructor(message: string);
}
/**
 * Error type thrown when an invalid Sort Direction is provided on the request.
 */
export declare class InvalidSortError extends KoaPageableError {
    static status: number;
    constructor();
}
/**
 * Enumeration of sort directions
 * @type {{asc: string, desc: string}}
 * @enum {string}
 */
export declare enum Direction {
    asc = "asc",
    desc = "desc"
}
/**
 * Pairing of a property and a {@link Direction}. Represents a single property that should be ordered as part of a
 * {@link Sort}
 * @param property The property to be ordered
 * @param direction The direction of the ordering, defaults to {@link Direction.asc}
 */
export declare class Order {
    direction: Direction;
    property: string;
    static _DEFAULT_DIRECTION: Direction;
    constructor(property: string, direction?: Direction);
}
/**
 * Sort options that should be applied to returned data set. Represents an iterable list of ordered properties.
 * @param orders Array of {@link Order} instances
 */
export declare class Sort {
    orders: Array<Order>;
    constructor(orders: Array<Order>);
    [Symbol.iterator](): {
        next: () => {
            done: boolean;
            value: Order;
        };
    };
    /**
     * Provides ability to execute Sort.forEach(...) and iterate over its contained list of {@link Order}s.
     *
     * @param iteratee Function invoked with and provided with each {@link Order}'s (property, direction) pair as
     *   arguments
     */
    forEach(iteratee: (property: string, direction: Direction) => any): void;
    /**
     * Overrides default serialization to  serialize the orders directly instead of serializing the Sort with a nested
     * order list
     */
    toJSON(): Array<Order>;
}
/**
 * Represents the configuration for a page of elements. Created by the middleware based on the request query parameters
 * @param pageNumber The page to be returned
 * @param pageSize The number of elements to be returned
 * @param sort Optional. The order to return the results in, ordered list of property, {@link Direction}.
 */
export declare class Pageable {
    /**
     * The number of the Page to be returned
     */
    page: number;
    /**
     * The number of elements in the Page to be returned
     */
    size: number;
    /**
     * The order of the elements in the Page to be returned
     */
    sort?: Sort;
    constructor(pageNumber?: number, pageSize?: number, sort?: string | Array<string> | Sort);
}
/**
 * "Base class" for container for content being returned.
 * @param totalElements The total number of elements in the data set
 * @param pageable The {@link Pageable} containing the paging information
 */
export declare class Page {
    /**
     * The number of the current page
     */
    number: number;
    /**
     * Size of the page (based on requested value)
     */
    size: number;
    /**
     * Number of elements in the current page
     */
    numberOfElements: number;
    /**
     * Total number of elements available
     */
    totalElements: number;
    /**
     * Total number of pages available
     */
    totalPages: number;
    /**
     * Sort of this page
     */
    sort?: Sort;
    /**
     * True if this is the first page
     */
    first: boolean;
    /**
     * True if this is the last page in the available data set
     */
    last: boolean;
    constructor(totalElements: number, pageable: Pageable);
}
/**
 * Represents a sublist of a list of objects. Provides details about the total list, including whether there is more
 * data available.
 * @param content The content to be returned
 * @param totalElements The total number of elements in the data set
 * @param pageable The {@link Pageable} containing the paging information
 */
export declare class ArrayPage<T> extends Page {
    /**
     * Array of content
     */
    content: Array<T>;
    constructor(content: Array<T>, totalElements: number, pageable: Pageable);
    /**
     * Returns a new Page created by invoking `iteratee` on each element in `content`
     *
     * @param iteratee Method to transform content elements
     * @returns Instance of Page
     */
    map<R>(iteratee: (value: T, index: number, array: T[]) => R): ArrayPage<R>;
}
/**
 * Koa Middleware function that reads pagination parameters from the query string, and populate `ctx.state.pageable`
 * with a {@link Pageable} instance.
 *
 * @param ctx Context associated with the Koa middleware function
 * @param next Middleware function called after {@link Pageable} property is set in state
 * @returns {Promise}
 */
export declare function paginateMiddleware(ctx: Context, next: Function): Promise<any>;
declare const _default: {
    paginateMiddleware: typeof paginateMiddleware;
    Order: typeof Order;
    ArrayPage: typeof ArrayPage;
    Direction: typeof Direction;
    InvalidSortError: typeof InvalidSortError;
    KoaPageableError: typeof KoaPageableError;
    NumberFormatError: typeof NumberFormatError;
    Page: typeof Page;
    Pageable: typeof Pageable;
    Sort: typeof Sort;
};
export default _default;
