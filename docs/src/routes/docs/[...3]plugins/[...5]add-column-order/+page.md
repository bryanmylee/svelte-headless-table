---
title: addColumnOrder
description: Re-order table columns
sidebar_title: addColumnOrder
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`addColumnOrder` re-orders table columns dynamicaly.

## Options

:::callout
Options passed into `addColumnOrder`.
:::

```ts {3}
const table = createTable(data, {
  colOrder: addColumnOrder({ ... }),
});
```

### `initialColumnIdOrder?: string[]`

Sets the initial column id order.

_Defaults to `[]`_.

### `hideUnspecifiedColumns?: boolean`

Hides columns that are not specified in `pluginStates.[pluginName].columnIdOrder`.

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
      colOrder: { ... },
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
    {rowProps.colOrder} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.colOrder} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

_Nothing here so far_.

## Plugin State

:::callout
State provided by `addColumnOrder`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.colOrder;
```

### `columnIdOrder: Writable<string[]>`

The active column id order.

## Examples

### Simple column ordering

:::example

[REPL](https://svelte.dev/repl/252964399eff408587ef164357aeb174?version=3.48.0)

<script>
  import SimpleColumnOrderDemo from './SimpleColumnOrderDemo.svelte'
</script>
<SimpleColumnOrderDemo />

:::
