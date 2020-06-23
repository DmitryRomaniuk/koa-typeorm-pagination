* [About](#about)
* [Overview](#overview)
  * [Request](#request)
    * [Query parameters](#query-parameters)
      * [Pageable](#pageable)
      * [Sort](#sort)
    * [Errors](#errors)
* [Getting Started](#getting-started)
  * [Installation](#installation)
    * [npm](#npm)
    * [yarn](#yarn)
  * [Requirements](#requirements)
  * [Examples](#examples)
    * [Router](#router)
    * [Data Access](#data-access)
* [API Documentation](#api-documentation)

# About
It's fork [koa-pageable](https://github.com/panderalabs/koa-pageable) but koa-pageable is unmaintained
`koa-typeorm-pagination` is middleware for pagination in [Koa](https://github.com/koajs/koa) inspired by [Spring Data](http://docs.spring.io/spring-data/commons/docs/current/reference/html/)'s Pagination support.

It allows clients of your API to easily request subsets of your data by providing query parameters to specify the amount, order, and formatting of the requested data. For instance, if you had an endpoint `/people` backed by a data store containing 1000 people records, `koa-pageable` allows a client to request the data be broken up into 10 person pages, and to receive 2nd page of people sorted by their lastname (`GET /people?page=1&size=10&sort=lastname`)

# Overview  
## Request 
### Query parameters
When enabled this middleware parses request query parameters from `ctx.query` into an instance of `Pageable`. 

**These values are:** 

Parameter | Default Value | Description  
----------|---------------|------------
`current` | `0`           | The 0-indexed page to be retrieved 
`pageSize`| `20`          | Maximum number of elements to be included in the retrieved page  
`sort`    | `undefined`   | Properties that should be sorted, in the specified order. Properties are separated by a `,` and directions are separated with a `:`. Valid directions are `asc` and `desc` and if not specified, direction defaults to `asc`. For example to sort by `lastname` ascending, then `firstname` descending: `?sort=lastname,firstname:desc`|         

#### Pageable
The `Pageable` object created from the query parameters contains two integers, `page` & `size`, an optional `Sort` instance, and an `indexed` boolean.
This `pageable` instance should  be passed to your data access layer, and its content should be used to restrict the returned data to the data specified by the `pageable`.

#### Sort
`Sort` is a collection of `property` and `direction`( `asc` or `desc`) pairs.
Each `sort` instance has a `forEach(callback(property,direction))` method that invokes `callback` for each `property`/`direction` pair in the `sort`  

### Errors
If the `page` or `size` query parameter are not specified as valid numbers, a `NumberFormatError` will be thrown. If the sort direction is specified as anything other than `asc` or `desc` (e.g. `sort=lastName:foo`) then an `InvalidSortError` will be thrown.

# Getting Started

## Installation
### npm
```
npm install koa-typeorm-pagination
```
### yarn
```
yarn add koa-typeorm-pagination
```

## Requirements
Requires `node` >= `8.2`, as `koa-pageable` makes use of async/await. [Typescript](https://www.typescriptlang.org/) bindings are also provided.   

`koa-ctx-pageable` is a convenient library for managing conversion of user intent (via request parameters) into a `Pageable` object, but it is still your responsibility to implement that intention when accessing data. You are responsible for ensuring that your data access tier properly implements the pagination and/or sorting, and for creating the `Page` instances to be returned. The exact approach for doing so will differ based on your chose Data Access framework. 

## Examples
### Router
```typescript
import { paginateMiddleware } from 'koa-typeorm-pagination';
import Koa from 'koa';

var app = new Koa();
app.use(paginateMiddleware);
```

### Data Access
Example of using `pageable` as input to a query, and `Page` as the response type. 

```typescript
import { paginate, IPaginationOptions } from 'koa-typeorm-pagination';

async function getData(paginateOptions: IPaginationOptions) {
 
  const queryBuilder = Person.query().where('age', '>', 21);
  
  return await paginate(queryBuilder, paginateOptions); 
}
```
