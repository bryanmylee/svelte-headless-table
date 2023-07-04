---
title: addResizedColumns
description: Dynamically resize columns
sidebar_title: addResizedColumns
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter.title}

`addResizedColumns` allows columns to be resized programatically and dynamically.

## Options

:::callout
Options passed into `addResizedColumns`.
:::

```ts {3}
const table = createTable(data, {
  resize: addResizedColumns({ ... }),
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
      resize: { ... },
    },
  }),
]);
```

### `initialWidth?: number`

Sets the initial width of the column in `px`.

_Defaults to `auto` width_.

### `minWidth?: number`

Sets the minimum width of the column in `px`.

_Defaults to no minimum width, but some elements have an intrinsic minimum width that cannot be overridden_.

### `maxWidth?: number`

Sets the maximum width of the column in `px`.

_Defaults to no maximum width_.

### `disable?: boolean`

Disables resizing on the column. If all columns of a group column are disabled, the group column is also disabled.

_Defaults to `false`_.

## Prop Set

:::callout
Extensions to the view model.

Subscribe to `.props()` on the respective table components.
:::

```svelte
{#each $headerRows as headerRow (headerRow.id)}
  <Subscribe rowProps={headerRow.props()} let:rowProps>
    {rowProps.resize} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.resize} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

### HeaderCell

The prop extension provided to `HeaderCell` is a [Svelte action](https://svelte.dev/tutorial/actions).

Use the action on the header cell element to initialize the plugin properly.

```svelte {7}
{#each headerRow.cells as cell (cell.id)}
  <Subscribe
    attrs={cell.attrs()} let:attrs
    props={cell.props()} let:props
  >
    <th {...attrs} use:props.resize>
      ...
    </th>
  </Subscribe>
{/each}
```

#### `drag: Action`

Use `drag` on a resizer element to provide drag-to-resize behaviour.

```svelte {7}
{#each headerRow.cells as cell (cell.id)}
  <Subscribe
    attrs={cell.attrs()} let:attrs
    props={cell.props()} let:props
  >
    <th {...attrs} use:props.resize>
      <div class="resizer" use:props.resize.drag />
    </th>
  </Subscribe>
{/each}

...

<style>
  th {
    position: relative;
  }

  .resizer {
    position: absolute;
    top: 0;
    bottom: 0;
    right: -4px;
    width: 8px;
    background: lightgray;
    cursor: col-resize;
    z-index: 1;
  }
</style>
```

#### `disabled: boolean`

Whether the data column represented by the header cell has resizing disabled.

## Plugin State

:::callout
State provided by `addResizedColumns`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.resize;
```

### `columnWidths: Writable<Record<string, number>>`

The current column widths. A record of column id to column width.

## Examples

### Simple column resizing

:::example

[REPL](https://svelte.dev/repl/92bc4b46e18342038666ad314cefb5de?version=3.48.0)

<script>
  import SimpleResizedColumnsDemo from './SimpleResizedColumnsDemo.svelte'
</script>
<SimpleResizedColumnsDemo />

:::
