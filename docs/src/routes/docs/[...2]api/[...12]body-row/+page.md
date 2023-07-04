---
title: BodyRow
description: The model for a body row
sidebar_title: BodyRow
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`BodyRow` represents the model of a `<tr>` element in `<tbody>`.

## Usage

### `id: string`

An `id` that uniquely identifies the row.

:::admonition type="warning"
Do not use `id` to identify a data item because `id` may also represent the structure of sub-rows. Use [`dataId`](#dataid-string) instead.
:::

`id` may be delimited by `>` to represent the `id` of parent rows if they exist.

### `attrs: () => Readable<BodyRowAttributes>`

A `Readable` store with attributes to apply onto the `<tr>` element.

### `props: () => Readable<BodyRowProps>`

A `Readable` store with additional properties derived from plugin view model extensions.

:::admonition type="tip"
See also [Plugin View Model Extensions](../plugins/overview#connecting-plugins-to-markup).
:::

### `cells: BodyCell[]`

An array of [`BodyCell`](./body-cell.md)s to iterate over and apply onto `<td>` elements.

`cells` only includes the cells of **visible columns**.

### `cellForId: Record<string, BodyCell>`

A record of column ids to [`BodyCell`](./body-cell.md)s.

`cellForId` also includes hidden cells and is useful when you need to reference to a specific cell.

### `depth: number`

The current depth of the row.

Starts at `0` for top-level rows and increases by one for each level of sub-row.

### `parentRow?: BodyRow`

The parent row of the current row if it exists.

`undefined` if this row is not a sub-row.

### `subRows?: BodyRow[]`

The sub rows of the current row if it exists. `undefined` if this row has no sub-rows.

By default, the following plugins can define sub-rows:

- [addSubRows](../plugins/add-sub-rows.md)
- [addGroupBy](../plugins/add-group-by.md)

### `isData: () => boolean`

Returns `true` if the body row is an instance of [`DataBodyRow`](#databodyrow).

### `isDisplay: () => boolean`

Returns `true` if the body row is an instance of [`DisplayBodyRow`](#displaybodyrow).

<br/>

# Variants

## DisplayBodyRow

`DisplayBodyRow`s represent rows which are **not backed by any data item**. These rows are usually the result of row aggregation with [`addGroupBy`](../plugins/add-group-by.md).

## DataBodyRow

`DataBodyRow`s represent rows which are **backed by a data item** from the data source.

### `dataId: string`

The original `id` of the data item from the data source.

This can be configured during [`createViewModel`](./create-view-model.md#options-rowdataid-item-index-string).

### `original: Item`

The original data item from the data source which backs this data row.

One common pattern is to define additional properties on the data items of the data source and access them via `row.original`.

```svelte
<script>
  const data = writable([
    {
      name: "Ada Lovelace",
      age: 28,
      disabled: true,
    },
    {
      name: "Ken Thompson",
      age: 64,
      disabled: false,
    },
    ...
  ]);
  ...
</script>
...
{#each $rows as row (row.id)}
  <Subscribe attrs={row.attrs()} let:attrs>
    <tr {...attrs} class:disabled={row.original.disabled}>
      ...
    </tr>
  <Subscribe>
{/each}
```
