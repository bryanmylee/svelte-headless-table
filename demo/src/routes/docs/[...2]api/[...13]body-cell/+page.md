---
title: BodyCell
description: The model for a body cell
sidebar_title: BodyCell
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter.title}

`BodyCell` represents the model of a `<td>` element in `<tr>`.

## Usage

### `id: string`

A constant `id` that uniquely identifies the body cell in the row.

### `attrs: () => Readable<BodyCellAttributes>`

A `Readable` store with attributes to apply onto the `<td>` element.

### `props: () => Readable<BodyCellProps>`

A `Readable` store with additional properties derived from plugin view model extensions.

:::admonition type="tip"
See also [Plugin View Model Extensions](../plugins/overview#connecting-plugins-to-markup).
:::

### `render: () => RenderConfig`

Returns the [render configuration](./--render.md#renderconfig) of the body cell. Pass into `Render#of`.

```svelte
<tr>
  {#each row.cells as cell (cell.id)}
    <Subscribe attrs={cell.attrs()} let:attrs>
      <td {...attrs}>
        <Render of={cell.render()} />
      </td>
    </Subscribe>
  {/each}
</tr>
```

### `row: BodyRow`

A reference to the [`BodyRow`](./body-row.md) that contains this cell.

### `column: Column`

A reference to the column that defines this cell. The variant of column depends on the variant of `BodyCell`.

### `rowColId: () => string`

A constant string that uniquely identifies the body cell in the table.

### `dataRowColId: () => string`

A constant string that uniquely identifies the data attribute of the body cell in the table.

### `isData: () => boolean`

Returns `true` if the body cell is an instance of [`DataBodyCell`](#databodycell).

### `isDisplay: () => boolean`

Returns `true` if the body cell is an instance of [`DisplayBodyCell`](#displaybodycell).


<br/>

# Variants

## DataBodyCell

`DataBodyCell`s represent cells which are backed by a data attribute on a data item from the data source.

### `value: unknown`

The value of the data cell.

## DisplayBodyCell

`DisplayBodyCell`s represent cells which are not backed by any data attribute.
