---
title: addDataExport
description: Export the transformed table as a new dataset.
sidebar_title: addDataExport
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`addDataExport` allows for reading the data source as it is currently transformed by the table.

This is useful if you need to export data from the table with all plugin transformations applied.

:::admonition type="warning"
Display columns do not contain any data by default and will show up as `null` in the data export.

If you need to add data to a display column, use the [`data`](../api/create-columns.md#displaydef-data-displaycell-state-readable-unknown-unknown) property when defining the display column.
:::

## Options

:::callout
Options passed into `addDataExport`.
:::

```ts {3}
const table = createTable(data, {
  export: addDataExport({ ... }),
});
```

### `format?: 'object' | 'json' | 'csv'`

Sets the exported data format.

_Defaults to `'object'`_.

### `childrenKey?: string`

The property key to store sub-rows under.

This only applies if `format` is `'object'` or `'json'`.

_Defaults to `'children'`_.

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
      export: { ... },
    },
  }),
]);
```

### `exclude?: boolean`

Excludes the column from the data export.

_Defaults to `false`_.

## Prop Set

:::callout
Extensions to the view model.

Subscribe to `.props()` on the respective table components.
:::

```svelte
{#each $headerRows as headerRow (headerRow.id)}
  <Subscribe rowProps={headerRow.props()} let:rowProps>
    {rowProps.export} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.export} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

_Nothing here so far_.

## Plugin State

:::callout
State provided by `addDataExport`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.export;
```

### `exportedData: Readable<DataExport>`

The exported data. `DataExport` is:

- `Record<string, unknown>[]` if `format` is `'object'`
- `string` if `format` is `'json'`
- `string` if `format` is `'csv'`

Either subscribe to `exportedData` or use [`get`](https://svelte.dev/docs#run-time-svelte-store-get) to compute the exported data once.
