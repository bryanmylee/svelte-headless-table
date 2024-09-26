---
title: Server Side
description: SSR table with drizzle
---

# {$frontmatter?.title}

A table rendered with +page.server.ts with pagination order and column filters using drizzle as a db

:::admonition type="info"

<!-- Source code available on the [REPL](https://svelte.dev/repl/44e2a26454ad478aa27e92b89e82e680?version=3.49.0). -->

REPL in progress
:::

+page.server.ts
```ts
import type { PageServerLoad } from './$types';
import * as schema from '$drizzle/schema';
import { withPagination, withOrderBy, getSQLiteColumn, getOrderBy } from '$drizzle/utils';
import { db } from '$drizzle/client.server';
import { and, eq, getTableColumns, SQL, count, like } from 'drizzle-orm';

export const load = (async ({ url }) => {
  const { searchParams } = url;
  const page = Number(searchParams.get('page') ?? 1);
  const pageSize = Number(searchParams.get('pageSize') ?? 10);

  const username = searchParams.get('username');
  const email = searchParams.get('email');

  const sortId = searchParams.get('sort_id');
  const sortOrder = searchParams.get('sort_order');

  let query = db
    .select()
    .from(schema.userTable)
    .where(
      and(
        username ? like(schema.userTable.username, `%${username}%`) : undefined,
        email ? like(schema.userTable.email, `%${email}%`) : undefined,
      ),
    )
    .$dynamic();

  if (sortId && sortOrder) {
    query = withOrderBy(query, getSQLiteColumn(schema.userTable, sortId), sortOrder);
  }

  try {
    const rows = await withPagination(query, page, pageSize);

    const total = await db.select({ count: count() }).from(schema.userTable);

    return { rows: rows ?? [], count: total[0].count };
  } catch (error) {
    console.error(error);
    return { rows: [], count: 0 };
  }
}) satisfies PageServerLoad;
```

+page.svelte
```svelte
<script lang="ts">
  import type { PageData } from './$types'

  // export let data: PageData

  let { data }: { data: PageData } = $props()

  import {
    createTable,
    Subscribe,
    Render,
    createRender,
    type DataLabel,
    type Column,
    type Table,
  } from 'svelte-headless-table'
  import {
    addSortBy,
    addColumnOrder,
    addColumnFilters,
    addSelectedRows,
    addResizedColumns,
    addGridLayout,
    addPagination,
  } from 'svelte-headless-table/plugins'
  import {
    readable,
    writable,
    type Writable,
    type Readable,
  } from 'svelte/store'
  import TextFilter from '$components/table/filters/TextFilter.svelte'
  import SelectIndicator from '$components/table/edit/SelectIndicator.svelte'
  import { goto } from '$app/navigation'
  import type { SelectUser } from '$drizzle/schema'

  import { page } from '$app/stores'

  function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number,
  ): (...args: Parameters<T>) => void {
    let timeoutId: number | undefined

    return (...args: Parameters<T>): void => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = window.setTimeout(() => func(...args), delay)
    }
  }

  const debounced_Filters_update = debounce(Filters_update, 550)

  let Filters = $derived($page.url)

  function Filters_get(name: string) {
    return Filters.searchParams.get(name)
  }

  function Filters_update({ name, value }: { name: string; value: string }) {
    if (name === undefined) return

    const url = new URL(Filters)

    if (!value) {
      url.searchParams.delete(name)
    }
    if (value !== '') url.searchParams.set(name, value)
    else url.searchParams.delete(name)
    console.log(url)

    const path_plus_params = url.pathname + url.search
    goto(path_plus_params, { keepFocus: true })
  }

  function Filters_update_many(params: Record<string, string>) {
    const url = new URL(Filters)
    Object.entries(params).forEach(([name, value]) => {
      if (!value) {
        url.searchParams.delete(name)
      }
      if (value !== '') url.searchParams.set(name, value)
      else url.searchParams.delete(name)
    })

    const path_plus_params = url.pathname + url.search
    goto(path_plus_params, { keepFocus: true })
  }

  function Filters_clear(...params: string[]) {
    const url = new URL(Filters)
    params.forEach(p => url.searchParams.delete(p))

    const path_plus_params = url.pathname + url.search
    goto(path_plus_params, { keepFocus: true })
  }

  function Filters_isFiltered(...params: string[]) {
    return params.length > 0 && params.some(p => Filters.searchParams.has(p))
  }

  const tableRows = writable(data.rows ?? [])

  const table = createTable(tableRows, {
    sort: addSortBy({
      disableMultiSort: true,
      serverSide: true,
    }),
    // colOrder: addColumnOrder(),
    filter: addColumnFilters({
      // serverSide: true,
    }),
    select: addSelectedRows({}),
    resize: addResizedColumns(),
    page: addPagination({
      initialPageSize: 15,
      initialPageIndex: 1,
      serverItemCount: readable(data.count),
      serverSide: true,
    }),
  })

  type ItemTable = typeof table

  type Plugins = ItemTable['plugins']

  const columns = [
    table.display({
      id: 'selected',
      header: '',
      cell: ({ row, column }, { pluginStates }) => {
        const { isSomeSubRowsSelected, isSelected } =
          pluginStates.select.getRowState(row)
        return createRender(SelectIndicator, {
          isSelected,
          isSomeSubRowsSelected,
        })
      },
    }),
    table.column({
      header: 'ID',
      accessor: 'id',
    }),
    table.column({
      header: 'Name',
      accessor: 'username',
      plugins: {
        sort: {
          invert: false,
          // disable: true,
        },
        filter: {
          fn: ({ filterValue, value }) => {
            debounced_Filters_update({
              name: 'username',
              value: filterValue,
            })
            return true
          },
          initialFilterValue: '',
          render: ({ filterValue, values, preFilteredValues }) =>
            createRender(TextFilter, {
              filterValue,
              values,
              preFilteredValues,
            }),
        },
      },
    }),
    table.column({
      header: 'Email',
      accessor: 'email',
      plugins: {
        sort: {
          invert: false,
          // disable: true,
        },
        filter: {
          fn: ({ filterValue, value }) => {
            debounced_Filters_update({
              name: 'email',
              value: filterValue,
            })
            return true
          },
          initialFilterValue: '',
          render: ({ filterValue, values, preFilteredValues }) =>
            createRender(TextFilter, {
              filterValue,
              values,
              preFilteredValues,
            }),
        },
      },
    }),
    table.column({
      header: 'Verified',
      accessor: 'emailVerified',
    }),
  ]

  const { headerRows, rows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns)

  const { sortKeys } = pluginStates.sort

  const { filterValues } = pluginStates.filter

  const { selectedDataIds } = pluginStates.select

  const { columnWidths } = pluginStates.resize

  const { pageIndex, pageCount, pageSize, hasNextPage, hasPreviousPage } =
    pluginStates.page

  $effect(() => {
    tableRows.set(data.rows)
    pageIndex.set(Number(Filters_get('page') ?? 1) - 1)

    const [sort] = $sortKeys
    console.log(sort)

    if (!sort) {
      Filters_update_many({ sort_id: '', sort_order: '' })
    } else {
      Filters_update_many({ sort_id: sort.id, sort_order: sort.order })
    }
  })
  // $inspect($tableBodyAttrs)
  // $inspect($tableAttrs)
  // $inspect($headerRows)
  // $inspect($rows)
  $inspect($sortKeys)
</script>

<main class="container mx-auto overflow-x-auto">
  <table {...$tableAttrs} class=" table w-full">
    <thead>
      {#each $headerRows as headerRow (headerRow.id)}
        <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
          <!-- HeaderRow props -->
          <tr {...rowAttrs}>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe
                attrs={cell.attrs()}
                let:attrs
                props={cell.props()}
                let:props
              >
                <th {...attrs}>
                  <button onclick={props.sort.toggle}>
                    <Render of={cell.render()} />
                  </button>
                  {#if props.sort.order === 'asc'}
                    ⬇️
                  {:else if props.sort.order === 'desc'}
                    ⬆️
                  {/if}
                  {#if props.filter?.render}
                    <div>
                      <Render of={props.filter.render} />
                    </div>
                  {/if}

                  {#if !props.resize.disabled}
                    <div class="resizer" use:props.resize.drag></div>
                  {/if}
                </th>
              </Subscribe>
            {/each}
          </tr>
        </Subscribe>
      {/each}
    </thead>
    <tbody {...$tableBodyAttrs}>
      {#each $rows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <tr {...rowAttrs}>
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <td {...attrs}>
                  <Render of={cell.render()} />
                </td>
              </Subscribe>
            {/each}
          </tr>
        </Subscribe>
      {/each}
    </tbody>
  </table>

  <div class="flex items-center justify-between">
    <div>
      <label for="pageSize">Page size</label>
      <input
        id="pageSize"
        type="number"
        class="w-3` input input-sm"
        min={1}
        max={100}
        onchange={e => {
          const value = (e.target as HTMLInputElement).value
          Filters_update({ name: 'pageSize', value: value })
        }}
      />
    </div>
    <div>
      <button
        class="btn"
        onclick={() => {
          Filters_update({ name: 'page', value: String($pageIndex) })
        }}
        disabled={!$hasPreviousPage}
      >
        Previous page
      </button>
      {$pageIndex + 1} out of {$pageCount}
      <button
        class="btn"
        onclick={() => {
          Filters_update({ name: 'page', value: String($pageIndex + 2) })
        }}
        disabled={!$hasNextPage}
      >
        Next page
      </button>
    </div>
  </div>
</main>

<style>
  table {
    border-spacing: 0;
    border-top: 1px solid black;
    border-left: 1px solid black;
  }
  th,
  td {
    border-bottom: 1px solid black;
    border-right: 1px solid black;
    padding: 0.5rem;
  }
  th {
    position: relative;
  }
  .resizer {
    position: absolute;
    top: 0;
    bottom: 0;
    right: -4px;
    width: 8px;
    background: lightgray;
    cursor: col-resize;
    z-index: 1;
  }
</style>
```

drizzle/utils
```ts
import {
  and,
  asc,
  count,
  desc,
  eq,
  like,
  getTableColumns,
  getOrderByOperators,
  getTableName,
  getOperators,
  SQL,
  type AnyColumn,
  sql,
} from 'drizzle-orm'
import {
  SQLiteTable,
  getTableConfig,
  type SQLiteSelect,
  type SQLiteColumn,
} from 'drizzle-orm/sqlite-core'

export function getSQLiteColumn<T extends SQLiteTable>(
  table: T,
  column_name: string,
) {
  const { columns } = getTableConfig(table)
  const column = columns.find(c => c.name == column_name)
  return column
}

export function withPagination<T extends SQLiteSelect>(
  qb: T,
  page: number = 1,
  pageSize: number = 15,
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize)
}

export function getOrderBy(column: AnyColumn, order?: string) {
  return order === 'asc' ? asc(column) : desc(column)
}

export function withOrderBy<T extends SQLiteSelect>(
  qb: T,
  column?: AnyColumn,
  order?: string | 'asc' | 'desc',
) {
  if (column) {
    return qb.orderBy(getOrderBy(column, order))
  }
  return qb
}

```