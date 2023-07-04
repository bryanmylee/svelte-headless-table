---
title: addSelectedRows
description: Select rows in the table
sidebar_title: addSelectedRows
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter.title}

`addSelectedRows` keeps track of selected items in the table. Complex behaviors with sub-rows is supported.

## Options

:::callout
Options passed into `addSelectedRows`.
:::

```ts {3}
const table = createTable(data, {
  select: addSelectedRows({ ... }),
});
```

### `initialSelectedDataIds?: Record<string, boolean>`

<!-- TODO document `BodyRow` and link to explanation about id vs dataId -->

Sets the initial selected row data ids.

Selected row ids are stored as an object of row data ids to `boolean`s. If `selectedDataIds[rowDataId]` is `true`, then `rowDataId` is selected. Otherwise, `rowDataId` is not selected.

_Defaults to `{}`_.

### `linkDataSubRows?: boolean`

Whether data rows should be linked to their parent or sub-rows when selecting / unselecting. If `true`, updating a parent row updates all sub-rows, and updating a sub-row affects parent rows. If `false`, all data rows will behave independently and not affect parent or sub-rows.

_Defaults to `true`_.

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
      select: { ... },
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
    {rowProps.select} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.select} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

### BodyRow

#### `selected: boolean`

Whether the row is selected.

#### `someSubRowsSelected: boolean`

Whether some sub-rows of the row are selected.

#### `allSubRowsSelected: boolean`

Whether all sub-rows of the row are selected.

## Plugin State

:::callout
State provided by `addSelectedRows`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.select;
```

<!-- TODO Document RecordSetStore -->

### `selectedDataIds: Writable<Record<string, boolean>>`

The current selected row data ids. Selected row ids are stored as an object of row data ids to `boolean`s. If `selectedDataIds[rowDataId]` is `true`, then `rowDataId` is selected. Otherwise, `rowDataId` is not selected.

### `allRowsSelected: Writable<boolean>`

Whether all rows in the table are selected.

Set to `true` to select all rows in the table or set to `false` to deselect all rows in the table.

### `someRowsSelected: Readable<boolean>`

Whether some rows in the table are selected.

### `allPageRowsSelected: Writable<boolean>`

Whether all rows in the current table page are selected.

Set to `true` to select all rows in the page or set to `false` to deselect all rows in the page.

### `somePageRowsSelected: Readable<boolean>`

Whether some rows in the page are selected.

### `getRowState: (row) => SelectedRowsRowState`

`getRowState` takes a `BodyRow` and returns `SelectedRowsRowState` for the row.

#### `SelectedRowsRowState#isSelected: Writable<boolean>`

Whether the row is selected. Update the store to select / deselect the row. If updating a row with sub-rows, this will also update all sub-rows.

#### `SelectedRowsRowState#isSomeSubRowsSelected: Readable<boolean>`

Whether some sub-rows of the row are selected.

#### `SelectedRowsRowState#isAllSubRowsSelected: Readable<boolean>`

Whether all sub-rows of the row are selected.

## Examples

### Simple row selection

:::example

[REPL](https://svelte.dev/repl/5f1213d65a774483b38b4e1d91135191?version=3.48.0)

<script>
  import SimpleSelectedDemo from './SimpleSelectedDemo.svelte'
</script>
<SimpleSelectedDemo />

:::
