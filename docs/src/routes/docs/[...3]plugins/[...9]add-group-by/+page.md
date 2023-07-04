---
title: addGroupBy
description: Group rows together based on column values
sidebar_title: addGroupBy
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`addGroupBy` groups rows together based on column values and provides aggregated values for groups of rows. Grouped rows are modelled as sub-rows of a grouping row.

The id of a sub-row is in the format `{parentId}>{id}`. A nested sub-row can be referred to by concatenating the ids of its parent rows to the top-level row.

## Options

:::callout
Options passed into `addGroupBy`.
:::

```ts {3}
const table = createTable(data, {
  group: addGroupBy({ ... }),
});
```

### `initialGroupByIds?: string[]`

Sets the initial column ids to group on.

_Defaults to `[]`_.

### `disableMultiGroup?: boolean`

Disables multi-grouping for the table.

_Defaults to `false`_.

### `isMultiGroupEvent?: (event: Event) => boolean`

Allows overriding the default multi-group behavior.

Takes an [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) and returns whether the action triggers a multi-group.

_Defaults to multi-group on shift-click_.

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
      group: { ... },
    },
  }),
]);
```

### `disable?: boolean`

Disables grouping on the column.

_Defaults to `false`_.

### `getAggregateValue?: (values) => any`

Defines how an aggregated values is calculated for the column.

Receives `values` of the column cells in the group and returns the value to display for the grouping row.

_Defaults to displaying a blank cell_.

### `getGroupOn?: (value) => string | number`

Defines the value that rows should be grouped on. Rows are grouped by equal values i.e. all rows that are grouped by a column share the same value for the column. Equivalently, `getGroupOn` defines the value to show on the grouping row.

_Required if `value` is not a `string` or `number`, defaults to (value) => value_.

#### `cell?: ({ column, row, value }, state) => RenderConfig`

Defines the component to use for the body cells of aggregated values on grouping rows.

`cell` is a function that takes

1. an object with a reference to the `BodyRow`, `DataColumn`, and `value` of the cell, and
2. [`TableState`](../api/table-state.md),

and returns a `RenderConfig`.

_Defaults to returning `value` as is_.

## Prop Set

:::callout
Extensions to the view model.

Subscribe to `.props()` on the respective table components.
:::

```svelte
{#each $headerRows as headerRow (headerRow.id)}
  <Subscribe rowProps={headerRow.props()} let:rowProps>
    {rowProps.group} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.group} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

### HeaderCell

#### `grouped: boolean`

Whether the data column represented by the header cell is currently grouped.

#### `disabled: boolean`

Whether grouping is disabled on the column represented by the header cell.

#### `toggle: (event: Event) => void`

Toggles grouping on the data column represented by the header cell.

#### `clear: () => void`

Clears grouping on the data column represented by the header cell.

### BodyCell

#### `repeated: boolean`

Whether the data cell is a repeated cell in a group.

#### `aggregated: boolean`

Whether the data cell is an aggregated cell on a grouping row.

#### `grouped: boolean`

Whether the data cell is an active grouping cell on a grouping row.

## Plugin State

:::callout
State provided by `addGroupBy`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.group;
```

### `groupByIds: ArraySetStore<string>`

The active grouping keys.

<!-- TODO Document ArraySetStore in separate page -->

`ArraySetStore<string>` is equivalent to `Writable<string[]>` with additional methods for set behavior.

#### `ArraySetStore#toggle: (item, { clearOthers?: boolean }) => void`

If `item` is in the set, remove it. If `item` is not in the set, add it.

If `clearOthers` is `true`, toggle `item` and remove all other elements in the set.

#### `ArraySetStore#add: (item) => void`

Add `item` to the set if it does not already exist in the set.

#### `ArraySetStore#remove: (item) => void`

Remove `item` from the set if it exists in the set.

#### `ArraySetStore#clear: () => void`

Remove all items from the set.

## Interactions with other plugins

### `addSortBy`

When `addGroupBy` is defined before `addSortBy`, all grouped values will be sorted within each group.

When `addGroupBy` is defined after `addSortBy`, only the top-level rows will be sorted.

### `addColumnFilters`

`addGroupBy` should be defined after `addColumnFilters` to ensure aggregate values are updated when filters are updated.

### `addTableFilter`

`addGroupBy` should be defined after `addTableFilter` to ensure aggregate values are updated when filters are updated.

## Examples

`addGroupBy` does not provide any visual feedback. Refer to [`addExpandedRows`](add-expanded-rows.md) for examples.
