import {
    ArrayPage,
    Direction,
    InvalidSortError,
    NumberFormatError,
    Order,
    Pageable,
    paginate,
    paginateMiddleware,
    Sort,
} from '../index'
import { Context } from 'koa'

describe('Tests', () => {
    const orders = [
        new Order('propertyA', Direction.asc),
        new Order('propertyB', Direction.desc),
        new Order('propertyC', Direction.asc),
        new Order('propertyD', Direction.desc),
        new Order('propertyE', Direction.desc),
    ]

    const pageOrders: Order[] = [
        new Order('firstName', Direction.asc),
        new Order('lastName', Direction.asc),
    ]

    const content = [
        { id: 1, firstName: 'Bob', lastName: 'Stevens' },
        { id: 2, firstName: 'Steve', lastName: 'Bobbins' },
        { id: 3, firstName: 'Robert', lastName: 'Stevenson' },
        { id: 4, firstName: 'Stevarino', lastName: 'Robertson' },
    ]

    describe('Order class', () => {
        it('returns "asc" for the static _DEFAULT_DIRECTION class property', () => {
            expect(Order._DEFAULT_DIRECTION).toEqual('asc')
        })

        it('instance.direction returns "asc" if no direction is specified in constructor', () => {
            const order = new Order('testProp')
            expect(order.direction).toEqual('asc')
        })

        it('instance.direction returns "desc" if direction parameter exactly matches "desc" in constructor', () => {
            const order = new Order('testProp', Direction.desc)
            expect(order.direction).toEqual('desc')
        })
    })

    describe('Sort class', () => {
        it('instance.toJSON() method result matches snapshot', () => {
            const sort = new Sort(orders)
            expect(sort.toJSON()).toMatchSnapshot()
        })

        it('iterates over orders using for...of loop', () => {
            const sort = new Sort(orders)
            const result = []
            for (const order of sort.toJSON()) {
                result.push(order)
            }
            expect(result).toMatchSnapshot()
        })

        it('instance.forEach() method result matches snapshot', () => {
            const sort = new Sort(orders)
            const valueGroups = {
                properties: [],
                directions: [],
            }
            const iteratee = (property: never, direction: never) => {
                valueGroups.properties.push(property)
                valueGroups.directions.push(direction)
            }
            sort.forEach(iteratee)
            expect(valueGroups).toMatchSnapshot()
        })
    })

    describe('Pageable class', () => {
        it('default values match snapshot when constructor parameters are undefined', () => {
            const pageable = new Pageable()
            expect(pageable).toMatchSnapshot()
        })
        ;[
            { value: 'singleValue', type: 'string' },
            {
                value: ['valueA', 'valueB:desc', 'valueC:desc'],
                type: 'array of strings',
            },
            { value: new Sort(orders.slice(1, 3)), type: 'sort' },
        ].forEach(({ value, type }) => {
            it(`returns a valid Sort instance when a value of type ${type} is passed to the constructor`, () => {
                const pageable = new Pageable(1, 10, value)
                expect(pageable.sort).toMatchSnapshot()
            })
        })

        it('disregards extra commas in the sort array passed in as a parameter', () => {
            const invalidSort = ['valueA,', 'valueB,,', 'valueC,,,']
            const result = new Pageable(0, 20, invalidSort)
            const invalidValues = result.sort?.orders.filter(
                (order) => order.property.length === 0
            )
            expect(invalidValues).toHaveLength(0)
        })

        it('disregards extra colons in the sort array passed in as a parameter', () => {
            const invalidSort = [
                'valueA:desc',
                'valueB::desc',
                'valueC::::desc',
            ]
            const pageable = new Pageable(0, 20, invalidSort)
            const invalidValues = pageable.sort?.orders.filter(
                (order) => order.property.length === 0
            )
            expect(invalidValues).toHaveLength(0)
        })
    })

    describe('ArrayPage class', () => {
        const getValidPage = () => {
            const sort = new Sort(pageOrders)
            const pageable = new Pageable(0, 20, sort)
            return new ArrayPage(content, 2, pageable)
        }

        it('matches snapshot when valid parameters are passed to the constructor', () => {
            const result = getValidPage()
            expect(result).toMatchSnapshot()
        })

        it('results of instance.map() method result matches snapshot', () => {
            const page = getValidPage()
            const result = page.map((pageContent, idx) => ({
                ...pageContent,
                age: idx * 5,
            }))
            expect(result).toMatchSnapshot()
        })
    })

    describe('paginate function', () => {
        const next = () => {}
        const context = {
            query: {
                page: 1,
                size: 20,
                sort: 'firstName',
                indexed: 'true',
            },
            state: {},
        } as Context

        it('context.state matches snapshot when paginate is called with valid context', async () => {
            await paginateMiddleware(context, next)
            expect(context.state).toMatchSnapshot()
        })

        it('context.state matches snapshot when paginate is called with string values for page and size', async () => {
            const updatedQuery = { ...context.query, page: '10', size: '15' }
            await paginateMiddleware({ ...context, query: updatedQuery }, next)
            expect(context.state).toMatchSnapshot()
        })

        it('context.state matches snapshot when paginate is called with empty strings for page and size', async () => {
            const updatedQuery = { ...context.query, page: '', size: '' }
            await paginateMiddleware({ ...context, query: updatedQuery }, next)
            expect(context.state).toMatchSnapshot()
        })

        it('context.state matches snapshot when paginate is called with undefined page, size, and sort', async () => {
            const updatedQuery = { indexed: 'true' }
            await paginateMiddleware({ ...context, query: updatedQuery }, next)
            expect(context.state).toMatchSnapshot()
        })

        it('throws error when paginate is called with invalid values for page and size', async () => {
            const updatedQuery = {
                ...context.query,
                page: 'page',
                size: 'size',
            }
            try {
                await paginateMiddleware(
                    { ...context, query: updatedQuery },
                    next
                )
            } catch (e) {
                expect(e.name).toBe('NumberFormatError')
            }
        })

        it('throws error when invalid sort direction is provided', async () => {
            const updatedQuery = { ...context.query, sort: 'firstName:foo' }
            try {
                await paginateMiddleware(
                    { ...context, query: updatedQuery },
                    next
                )
            } catch (e) {
                expect(e.name).toBe('InvalidSortError')
            }
        })
    })
})
