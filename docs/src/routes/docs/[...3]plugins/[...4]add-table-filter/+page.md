---
title: addTableFilter
description: Filter table rows by searching all cell values
sidebar_title: addTableFilter
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`addTableFilter` filters table rows on data that may be in _any_ column.

## Options

:::callout
Options passed into `addTableFilter`.
:::

```ts {3}
const table = createTable(data, {
  filter: addTableFilter({ ... }),
});
```

### `fn?: ({ filterValue, value }) => boolean`

Defines the filter behavior for the column.

Receives a `filterValue` and the column cell `value` (or the value returned from [`getFilterValue`](#getfiltervalue-value-string)), and returns `true` if the cell should be visible.

`filterValue` is a `string`, and `value` will be serialized into a `string`.

_Defaults to case-insensitive prefix matching._

### `initialFilterValue?: string`

Defines the initial filter value.

_Defaults to `''`_.

### `includeHiddenColumns?: boolean`

Determines if hidden columns should be searched for matching values.

_Defaults to `false`_.

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
      filter: { ... },
    },
  }),
]);
```

### `exclude?: boolean`

Determines if the column should be excluded when searching for matching values.

_Defaults to false_.

### `getFilterValue?: (value) => string`

Receives the value of the column cell and returns the value to filter the column on.

_Defaults to serializing the value to `string`_.

## Prop Set

:::callout
Extensions to the view model.

Subscribe to `.props()` on the respective table components.
:::

```svelte
{#each $headerRows as headerRow (headerRow.id)}
  <Subscribe rowProps={headerRow.props()} let:rowProps>
    {rowProps.filter} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.filter} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

### BodyCell

#### `matches: boolean`

Whether the body cell matches the current filter value.

Useful for highlighting the matching cell of the filtered rows.

## Plugin State

:::callout
State provided by `addTableFilter`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.filter;
```

### `preFilteredRows: Readable<BodyRow<Item>[]>`

The view model rows before filtering.

### `filterValue: Writable<string>`

The active filter value.

## Examples

### Simple table filtering

:::example

[REPL](https://svelte.dev/repl/b14e9a90ad6c40ab85b18c9421820487?version=3.48.0)

<script>
  import SimpleTableFilteringDemo from './SimpleTableFilteringDemo.svelte';
</script>
<SimpleTableFilteringDemo />
:::
