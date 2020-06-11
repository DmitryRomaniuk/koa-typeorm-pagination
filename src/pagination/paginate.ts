import {
    Repository,
    FindConditions,
    FindManyOptions,
    SelectQueryBuilder,
} from 'typeorm'
import { Pagination } from './pagination'
import { IPaginationOptions } from './interfaces'

export async function paginate<T>(
    repository: Repository<T>,
    options: IPaginationOptions,
    searchOptions?: FindConditions<T> | FindManyOptions<T>
): Promise<Pagination<T>>
export async function paginate<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions
): Promise<Pagination<T>>

export async function paginate<T>(
    repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
    options: IPaginationOptions,
    searchOptions?: FindConditions<T> | FindManyOptions<T>
) {
    return repositoryOrQueryBuilder instanceof Repository
        ? paginateRepository<T>(
              repositoryOrQueryBuilder,
              options,
              searchOptions
          )
        : paginateQueryBuilder(repositoryOrQueryBuilder, options)
}

function createPaginationObject<T>(
    content: T[],
    totalItems: number,
    current: number,
    pageSize: number
) {
    const totalPages = Math.ceil(totalItems / pageSize)

    return new Pagination(
        content,

        {
            itemCount: content.length,
            total: totalItems,
            pageSize: pageSize,

            totalPages: totalPages,
            current: current,
        }
    )
}

function resolveOptions(options: IPaginationOptions): [number, number] {
    const current = options.current
    const pageSize = options.pageSize

    return [current, pageSize]
}

async function paginateRepository<T>(
    repository: Repository<T>,
    options: IPaginationOptions,
    searchOptions?: FindConditions<T> | FindManyOptions<T>
): Promise<Pagination<T>> {
    const [page, limit] = resolveOptions(options)

    if (page < 1) {
        return createPaginationObject([], 0, page, limit)
    }

    const [items, total] = await repository.findAndCount({
        skip: limit * (page - 1),
        take: limit,
        ...searchOptions,
    })

    return createPaginationObject<T>(items, total, page, limit)
}

async function paginateQueryBuilder<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions
): Promise<Pagination<T>> {
    const [page, limit] = resolveOptions(options)

    const [items, total] = await queryBuilder
        .take(limit)
        .skip((page - 1) * limit)
        .getManyAndCount()

    return createPaginationObject<T>(items, total, page, limit)
}
