import type { Context } from 'koa'
import { flatMap, keyBy, isEmpty, mapValues } from 'lodash'

/**
 * Base Class for error types thrown by Koa Paginate.
 *
 * @param message The human-readable message describing the error
 */
export class KoaPageableError extends Error {
    /**
     * HTTP Status code to be returned, 400
     */
    static status = 400

    /**
     * Stack trace obtained via Error().stack
     */
    stack?: string

    /**
     * Human readable description of error
     */
    message: string

    /**
     * Name of the error
     * @param message
     */
    name: string

    constructor(message: string) {
        super(message)
        this.name = 'KoaPageableError'
        this.message = message
        this.stack = new Error().stack
    }
}

/**
 * Error type thrown when parsing Pagination parameters fails
 * @param message The human-readable message describing the error
 */
export class NumberFormatError extends KoaPageableError {
    static status = 400

    constructor(message: string) {
        super(message)
        this.name = 'NumberFormatError'
        this.message = message
        this.stack = new Error().stack
    }
}

/**
 * Error type thrown when an invalid Sort Direction is provided on the request.
 */
export class InvalidSortError extends KoaPageableError {
    static status = 400

    constructor() {
        const msg = 'Invalid Sort Direction, must be one of "asc" or "desc"'
        super(msg)
        this.name = 'InvalidSortError'
        this.message = msg
        this.stack = new Error().stack
    }
}

/**
 * Converts the input into a number it it's a valid numeric string, otherwise it throws a NumberFormatError
 *
 * @param input Input to convert to number
 * @returns Numeric value of string
 */
function parseIntOrThrow(input: string): number {
    const result = parseInt(input, 10)

    if (Number.isNaN(result)) {
        throw new NumberFormatError(`Could not convert '${input}' to number`)
    }
    return result
}

/**
 * Converts the input to a number if it's a valid numeric string using {@link parseIntOrThrow}. If the input isn't
 * specified, returns null
 *
 * @param input Input to convert to number
 * @returns Null or numeric value of string
 */
function parseOptionalIntOrThrow(input?: string): number | null {
    if (!input) {
        return null
    }
    return parseIntOrThrow(input)
}

/**
 * Enumeration of sort directions
 * @type {{asc: string, desc: string}}
 * @enum {string}
 */
export enum Direction {
    asc = 'asc',
    desc = 'desc',
}

/**
 * Pairing of a property and a {@link Direction}. Represents a single property that should be ordered as part of a
 * {@link Sort}
 * @param property The property to be ordered
 * @param direction The direction of the ordering, defaults to {@link Direction.asc}
 */
export class Order {
    direction: Direction
    property: string

    static _DEFAULT_DIRECTION = Direction.asc

    constructor(
        property: string,
        direction: Direction = Order._DEFAULT_DIRECTION
    ) {
        this.direction = Order._DEFAULT_DIRECTION

        // only set it to desc if it's an exact match, else default
        if (direction.toLowerCase() === Direction.desc) {
            this.direction = Direction.desc
        }

        this.property = property
    }
}

/**
 * Function that converts between a string and a {@link Direction}
 * @param dir The string to convert into a typed {@link Direction}
 * @returns {Direction} If the parameter exactly matches "asc" or "desc" returns the corresponding
 * {@link Direction}. If dir is blank the default direction {@link Direction.asc} will be returned. Else an
 *   {@link InvalidSortError} is thrown
 */
function stringToDirection(dir: string): Direction {
    if (isEmpty(dir)) {
        return Order._DEFAULT_DIRECTION
    }
    if (dir === Direction.asc) {
        return Direction.asc
    } else if (dir === Direction.desc) {
        return Direction.desc
    }
    throw new InvalidSortError()
}

/**
 * Sort options that should be applied to returned data set. Represents an iterable list of ordered properties.
 * @param orders Array of {@link Order} instances
 */
export class Sort {
    orders: Array<Order>

    constructor(orders: Array<Order>) {
        this.orders = orders
    }

    [Symbol.iterator]() {
        const values = Object.values(this.orders)
        let count = 0
        let done = false

        const next = () => {
            done = count >= values.length
            const value = values[(count += 1)]
            return { done, value }
        }
        return { next }
    }

    /**
     * Provides ability to execute Sort.forEach(...) and iterate over its contained list of {@link Order}s.
     *
     * @param iteratee Function invoked with and provided with each {@link Order}'s (property, direction) pair as
     *   arguments
     */
    forEach(iteratee: (property: string, direction: Direction) => any) {
        this.orders.forEach((it) => iteratee(it.property, it.direction))
    }

    /**
     * Overrides default serialization to  serialize the orders directly instead of serializing the Sort with a nested
     * order list
     */
    toJSON(): Array<Order> {
        return this.orders
    }
}

/**
 * Convert query param(s) into a Sort object. Supports both single (&foo=bar) and multi-value (&foo=bar&foo=baz) params
 *
 * @param sortRequestQuery Query param(s) to sort by
 * @returns Instance of Sort
 * @throws {@link InvalidSortError} if requested direction is not "asc" or "desc"
 */
function parseSort(sortRequestQuery: string | Array<string>): Sort {
    let paramArray: Array<string>

    // Multi-value params - convert to flat list of string
    if (Array.isArray(sortRequestQuery)) {
        paramArray = flatMap(sortRequestQuery.map((it) => it.split(',')))
    } else {
        // single param
        paramArray = sortRequestQuery.split(',')
    }
    // Ensure that only valid values are used (multiple commas are excluded).
    const validArray = paramArray.filter((param) => param.length > 0)

    const orderList = validArray.map((it) => {
        // Ensure that only valid values are used (if multiple colons were specified in error).
        const result = it.split(':').filter((value) => value.length > 0)
        return new Order(result[0], stringToDirection(result[1]))
    })

    return new Sort(orderList)
}

/**
 * Represents the configuration for a page of elements. Created by the middleware based on the request query parameters
 * @param pageNumber The page to be returned
 * @param pageSize The number of elements to be returned
 * @param sort Optional. The order to return the results in, ordered list of property, {@link Direction}.
 */
export class Pageable {
    /**
     * The number of the Page to be returned
     */
    page: number
    /**
     * The number of elements in the Page to be returned
     */
    size: number
    /**
     * The order of the elements in the Page to be returned
     */
    sort?: Sort

    constructor(
        pageNumber: number = 0,
        pageSize: number = 20,
        sort?: string | Array<string> | Sort
    ) {
        this.page = pageNumber
        this.size = pageSize

        if (sort) {
            if (sort instanceof Sort) {
                this.sort = sort
            } else {
                this.sort = parseSort(sort)
            }
        }
    }
}

/**
 * "Base class" for container for content being returned.
 * @param totalElements The total number of elements in the data set
 * @param pageable The {@link Pageable} containing the paging information
 */
export class Page {
    /**
     * The number of the current page
     */
    number: number

    /**
     * Size of the page (based on requested value)
     */
    size: number

    /**
     * Number of elements in the current page
     */
    numberOfElements: number

    /**
     * Total number of elements available
     */
    totalElements: number

    /**
     * Total number of pages available
     */
    totalPages: number

    /**
     * Sort of this page
     */
    sort?: Sort

    /**
     * True if this is the first page
     */
    first: boolean

    /**
     * True if this is the last page in the available data set
     */
    last: boolean

    constructor(totalElements: number, pageable: Pageable) {
        this.number = pageable.page
        this.size = pageable.size
        this.sort = pageable.sort
        this.totalElements = totalElements

        // calculated values
        this.totalPages = Math.max(Math.ceil(totalElements / this.size), 1)
        this.first = this.number === 0
        this.last = this.number >= this.totalPages - 1
    }
}

// Sadly documentation.js does not reasonably  handle inheritance
// (https://github.com/documentationjs/documentation/issues/390)  Can remove the duplicated constructor parameters on
// children of Page once the above is resolved.

/**
 * Represents a sublist of a list of objects. Provides details about the total list, including whether there is more
 * data available.
 * @param content The content to be returned
 * @param totalElements The total number of elements in the data set
 * @param pageable The {@link Pageable} containing the paging information
 */
export class ArrayPage<T> extends Page {
    /**
     * Array of content
     */
    content: Array<T>

    constructor(
        content: Array<T> = [],
        totalElements: number,
        pageable: Pageable
    ) {
        super(totalElements, pageable)
        this.content = content
        this.numberOfElements = this.content.length
    }

    /**
     * Returns a new Page created by invoking `iteratee` on each element in `content`
     *
     * @param iteratee Method to transform content elements
     * @returns Instance of Page
     */
    map<R>(iteratee: (value: T, index: number, array: T[]) => R): ArrayPage<R> {
        return new ArrayPage(
            this.content.map(iteratee),
            this.totalElements,
            new Pageable(this.number, this.size, this.sort)
        )
    }
}

/**
 * Koa Middleware function that reads pagination parameters from the query string, and populate `ctx.state.pageable`
 * with a {@link Pageable} instance.
 *
 * @param ctx Context associated with the Koa middleware function
 * @param next Middleware function called after {@link Pageable} property is set in state
 * @returns {Promise}
 */
export async function paginateMiddleware(ctx: Context, next: Function) {
    const page = parseOptionalIntOrThrow(ctx.query.current) || 0
    const size = parseOptionalIntOrThrow(ctx.query.pageSize) || 20
    const sort = ctx.query.sort || null

    ctx.state.pageable = new Pageable(page, size, sort)
    return next()
}

export default {
    paginateMiddleware,
    Order,
    ArrayPage,
    Direction,
    InvalidSortError,
    KoaPageableError,
    NumberFormatError,
    Page,
    Pageable,
    Sort,
}
