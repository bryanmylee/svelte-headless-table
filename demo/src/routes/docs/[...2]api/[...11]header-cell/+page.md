---
title: HeaderCell
description: The model for a header cell
sidebar_title: HeaderCell
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter.title}

`HeaderCell` represents the model of a `<th>` element in `<tr>`.

## Usage

### `id: string`

A constant `id` that uniquely identifies the header cell in the row.

### `attrs: () => Readable<HeaderCellAttributes>`

A `Readable` store with attributes to apply onto the `<th>` element.

### `props: () => Readable<HeaderCellProps>`

A `Readable` store with additional properties derived from plugin view model extensions.

:::admonition type="tip"
See also [Plugin View Model Extensions](../plugins/overview#connecting-plugins-to-markup).
:::

### `render: () => RenderConfig`

Returns the [render configuration](./--render.md#renderconfig) of the header cell. Pass into `Render#of`.

```svelte
<tr>
  {#each headerRow.cells as cell (cell.id)}
    <Subscribe attrs={cell.attrs()} let:attrs>
      <th {...attrs}>
        <Render of={cell.render()} />
      </th>
    </Subscribe>
  {/each}
</tr>
```

### `isFlat: () => boolean`

Returns `true` if the header cell is an instance of [`FlatHeaderCell`](#flatheadercell).

### `isData: () => boolean`

Returns `true` if the header cell is an instance of [`DataHeaderCell`](#dataheadercell).

### `isFlatDisplay: () => boolean`

Returns `true` if the header cell is an instance of [`FlatDisplayHeaderCell`](#flatdisplayheadercell).

### `isGroup: () => boolean`

Returns `true` if the header cell is an instance of [`GroupHeaderCell`](#groupheadercell).

### `isGroupDisplay: () => boolean`

Returns `true` if the header cell is an instance of [`GroupDisplayHeaderCell`](#groupdisplayheadercell).

<br />

# Variants

## FlatHeaderCell

`FlatHeaderCell`s represent header cells on the last header row in the table header.

## DataHeaderCell

`DataHeaderCell` is a `FlatHeaderCell` that is backed by a specific data attribute.

`DataHeaderCell`s are usually created with [`Table#column`](./create-columns.md#table-column-columndef-datacolumn).

### `accessorKey?: string`

The attribute key of the data item.

### `accessorFn?: (item) => unknown`

The function to derive the data attribute.

## FlatDisplayHeaderCell

`FlatDisplayHeaderCell` is a `FlatHeaderCell` that is not backed by any data attribute.

`FlatDisplayHeaderCell`s are usually created with [`Table#display`](./create-columns.md#table-display-displaydef-displaycolumn).

## GroupHeaderCell

`GroupHeaderCell`s represent header cells that span over other header cells.

### `ids: string[]`

A list of ids of the cells that this group cell currently spans over.

`ids` is affected by column re-ordering and hiding.

### `allIds: string[]`

A list of ids of the cells grouped by this group cell.

`allIds` is not affected by column re-ordering and hiding.

### `allId: string`

A comma-joined string for `allIds`. `allId` should not be used as a unique identifier because there can be multiple groups with the same `allId`.

## GroupDisplayHeaderCell

`GroupDisplayHeaderCell` is a `GroupHeaderCell` that is not backed by any data attribute.
