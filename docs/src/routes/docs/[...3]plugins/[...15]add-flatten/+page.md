---
title: addFlatten
description: Flatten data by surfacing subrows up multiple levels.
sidebar_title: addFlatten
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`addFlatten` flattens the table by removing parent rows and bringing subrows up.

## Options

:::callout
Options passed into `addFlatten`.
:::

```ts {3}
const table = createTable(data, {
  flatten: addFlatten({ ... }),
});
```

### `initialDepth?: number`

How many levels to flatten.

_Defaults to `0`_.

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
      flatten: { ... },
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
    {rowProps.flatten} <!-- HeaderRow props -->
    {#each headerRow.cells as cell (cell.id)}
      <Subscribe props={cell.props()} let:props>
        {props.flatten} <!-- HeaderCell props -->
      </Subscribe>
    {/each}
  </Subscribe>
{/each}
```

### Bodycell

#### `flatten: (depth: number) => void`

Flattens the table up to a certain depth.

#### `unflatten: () => void`

Unflattens the table.

## Plugin State

:::callout
State provided by `addFlatten`.
:::

```ts {3}
const { headerRows, rows, pluginStates } = table.createViewModel(columns);
const { ... } = pluginStates.flatten;
```

### `depth: Writable<number>`

The current depth to flatten to.
