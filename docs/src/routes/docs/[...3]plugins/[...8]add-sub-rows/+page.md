---
title: addSubRows
description: Define sub-rows of rows
sidebar_title: addSubRows
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`addSubRows` defines the data for deriving the sub-rows of a row. It is commonly used with `addExpandedRows` to visualize sub-rows.

The id of a sub-row is in the format `{parentId}>{id}`. A nested sub-row can be referred to by concatenating the ids of its parent rows to the top-level row.

## Options

:::callout
Options passed into `addSubRows`.
:::

```ts {3}
const table = createTable(data, {
  sub: addSubRows({ ... }),
});
```

### `children: string | (item) => Item[]`

Defines child items. Child items must be an array of items with same type as the parent item.

If `children` is a string, the child items **must exist as a direct property on each data item**. If a nested property or computed property is needed, pass a function that receives a data item and returns an array of child items.

If the child items returned is `undefined` or `[]`, no sub-rows will be generated for the row.

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
      sub: { ... },
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
    {rowProps.sub} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.sub} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

_Nothing here so far_.

## Plugin State

:::callout
State provided by `addSubRows`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.sub;
```

_Nothing here so far_.

## Interactions with other plugins

### `addSortBy`

When `addSubRows` is defined before `addSortBy`, all sub-rows will be sorted within each group.

When `addSubRows` is defined after `addSortBy`, only the top-level rows will be sorted.

### `addColumnFilters`

When `addSubRows` is defined before `addColumnFilters`, all sub-rows will be searched for matching values. If a row has a sub-row that matches the filter, it will not be hidden even if it does not match the filter itself.

When `addSubRows` is defined after `addColumnFilters`, only the top-level rows will be searched for matching values.

### `addTableFilter`

When `addSubRows` is defined before `addTableFilter`, all sub-rows will be searched for matching values. If a row has a sub-row that matches the filter, it will not be hidden even if it does not match the filter itself.

When `addSubRows` is defined after `addTableFilter`, only the top-level rows will be searched for matching values.

## Examples

`addSubRows` does not provide any visual feedback. Refer to [`addExpandedRows`](add-expanded-rows.md) for examples.
