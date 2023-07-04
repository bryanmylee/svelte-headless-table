---
title: addPagination
description: Paginate table rows
sidebar_title: addPagination
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter.title}

`addPagination` paginates the table by page index. For token-based pagination, refer to [`addTokenPagination`](#).

:::admonition type="note"
Subscribe to [`TableViewModel#pageRows`](../api/create-view-model.md#tableviewmodel-pagerows-readable-bodyrow) instead of `TableViewModel#rows`.
:::

```svelte {5,11}
<script>
  const {
    headerRows,
    pageRows,
  } = table.createViewModel(columns);
</script>

<table>
  <tbody>
    {#each $pageRows as row (row.id)}
      ...
    {/each}
  </tbody>
</table>
```

## Options

:::callout
Options passed into `addPagination`.
:::

```ts {3}
const table = createTable(data, {
  page: addPagination({ ... }),
});
```

### `initialPageIndex?: number`

Sets the initial page index.

_Defaults to `0`_.

### `initialPageSize?: number`

Sets the initial page size.

_Defaults to `10`_.

## Column Options

:::callout
Options passed into column definitions.
:::

```ts {7}
const columns = table.createColumns([
  table.column({
    header: 'Name',
    accessor: 'name',
    plugins: {
      page: { ... },
    },
  }),
]);
```

_Nothing here so far_.

## Prop Set

:::callout
Extensions to the view model.

Subscribe to `.props()` on the respective table components.
:::

```svelte
{#each $headerRows as headerRow (headerRow.id)}
  <Subscribe rowProps={headerRow.props()} let:rowProps>
    {rowProps.page} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.page} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

_Nothing here so far_.

## Plugin State

:::callout
State provided by `addPagination`.
:::

```ts {3}
const { headerRows, pageRows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.page;
```

### `pageSize: Writable<number>`

The current number of rows per page. If a value less than `1` is set, a minimum value of `1` is enforced.

### `pageIndex: Writable<number>`

The current page index.

### `hasPreviousPage: Readable<boolean>`

Whether a previous page is available.

### `hasNextPage: Readable<boolean>`

Whether a next page is available.

### `pageCount: Readable<number>`

The total number of pages derived from the number of rows and page size.

## Examples

### Simple pagination

:::example

[REPL](https://svelte.dev/repl/27d0aa87d94d40939923f63b4e5eb6f5?version=3.48.0)

<script>
  import SimplePaginationDemo from './SimplePaginationDemo.svelte'
</script>
<SimplePaginationDemo />

:::
