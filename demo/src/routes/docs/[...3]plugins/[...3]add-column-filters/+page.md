---
title: addColumnFilters
description: Filter table rows by column values
sidebar_title: addColumnFilters
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter.title}

`addColumnFilters` filters table rows by specific column values.

## Options

:::callout
Options passed into `addColumnFilters`.
:::

```ts {3}
const table = createTable(data, {
  colFilter: addColumnFilters({ ... }),
});
```

_Nothing here so far_.

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
      colFilter: { ... },
    },
  }),
]);
```

### `fn: ({ filterValue, value }) => boolean`

Defines the filter behavior for the column.

Receives `filterValue` and the column cell `value`, and returns `true` if the cell should be visible.

### `render: (renderProps) => RenderConfig`

Defines the component to render on `HeaderCell->props.[pluginName].render`.

`renderProps` extends [`TableState`](../api/table-state.md) and includes additional properties.

#### `renderProps.id: string`

The id of the column.

#### `renderProps.filterValue: Writable<any>`

A `Writable` store with the current filter value.

#### `renderProps.values: Readable<any[]>`

A `Readable` store with the filtered values on the column.

#### `renderProps.preFilteredValues: Readable<any[]>`

A `Readable` store with the pre-filtered values on the column.

#### `renderProps.preFilteredRows: Readable<BodyRow[]>`

A `Readable` store with the pre-filtered rows on the table.

### `initialFilterValue?: any`

Defines the initial filter value for the column.

_Defaults to `undefined`_.

## Prop Set

:::callout
Extensions to the view model.

Subscribe to `.props()` on the respective table components.
:::

```svelte
{#each $headerRows as headerRow (headerRow.id)}
  <Subscribe rowProps={headerRow.props()} let:rowProps>
    {rowProps.colFilter} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.colFilter} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

### HeaderCell

Possibly `undefined` if no filter is configured on the column represented by the header cell.

#### `render: RenderConfig | undefined`

The `render` component defined in the column options of the data column represented by the header cell.

## Plugin State

:::callout
State provided by `addColumnFilters`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.colFilter;
```

### `preFilteredRows: Readable<BodyRow<Item>[]>`

The view model rows before filtering.

### `filterValues: Writable<Record<Id, FilterValue>>`

The active filter values. A record of column id to filter value.

## Examples

### Simple filtering

:::example

[REPL](https://svelte.dev/repl/e5da30febf484b39b7a0c2c4030ce5c9?version=3.48.0)

<script>
  import SimpleFilteringDemo from './SimpleFilteringDemo.svelte';
</script>
<SimpleFilteringDemo />
:::
