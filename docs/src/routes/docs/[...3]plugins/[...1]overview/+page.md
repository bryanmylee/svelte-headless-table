---
title: The Plugin System
description: Extending the functionality of Svelte Headless Table with powerful plugins
---

# {$frontmatter?.title}

Svelte Headless Table is designed with extensibility in mind. Its complex features are powered by an extensive suite of plugins.

<script>
  import CheckIcon from '~icons/ic/round-check-circle-outline'
  import PendingIcon from '~icons/ic/outline-pending';
</script>

<ul class="grid text-sm md:text-base grid-cols-2 gap-2 p-0 lg:grid-cols-3">
  {#each [
    'addSortBy', 'addColumnFilters', 'addTableFilter',
    'addColumnOrder', 'addHiddenColumns', 'addPagination',
    'addSubRows', 'addGroupBy', 'addExpandedRows',
    'addSelectedRows', 'addResizedColumns', 'addGridLayout'
  ] as pluginName}
    <li class="flex gap-2 items-center m-0 list-none">
      <CheckIcon class="text-brand m-0 wh-7 min-wh-7"/> <code class="m-0">{pluginName}</code>
    </li>
  {/each}
</ul>

## Defining plugins

Svelte Headless Table treats each plugin as an extension to its core. Every plugin optionally defines transformations on the rows and columns of the table, and extends the functionality of column definitions, rows, and cells.

For this example, we extend a basic table with `addSortBy` and `addColumnOrder`.

```ts {3-4}
const table = createTable(data, {
  sort: addSortBy({ disableMultiSort: true }),
  colOrder: addColumnOrder(),
});
```

Plugins are configurable via function arguments.

:::admonition type="info"
`sort` and `colOrder` are just names to identify the plugins – they can be any name you prefer as long as they remain consistent. This lets you add multiple plugins to a table without any naming conflicts.
:::

The order in which you define plugins matters – [the order of object keys is predictable](https://www.stefanjudis.com/today-i-learned/property-order-is-predictable-in-javascript-objects-since-es2015/) and plugins are evaluated from first to last.

## Configuring columns

Plugins optionally define additional **column options** to configure column behavior. Column options are specified under the optional `plugins` property in the column definition.

```ts {6-8}
const columns = table.createColumns([
  table.column({
    header: 'Name',
    accessor: 'name',
    plugins: {
      sort: { invert: true },
    },
  }),
  table.column({
    header: 'Age',
    accessor: 'age',
  }),
]);
```

:::admonition type="info"
The column options of a plugin are specified under its given name. **Because we named our sorting plugin `sort`, its column options are defined under `plugins.sort`**.
:::

## Connecting plugins to markup

Plugins extend the view model with **prop sets** that provide additional props to table components via `.props()`. Props can include state and event handlers.

`.props()` returns a `Readable` store, so pass it into `Subscribe` to access its value.

```svelte {10,12,14-18}
<table {...$tableAttrs}>
  <thead>
    {#each $headerRows as headerRow (headerRow.id)}
      <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each headerRow.cells as cell (cell.id)}
            <Subscribe
              attrs={cell.attrs()} let:attrs
              props={cell.props()} let:props
            >
              <th {...attrs} on:click={props.sort.toggle}>
                <Render of={cell.render()} />
                {#if props.sort.order === 'asc'}
                  ⬇️
                {:else if props.sort.order === 'desc'}
                  ⬆️
                {/if}
              </th>
            </Subscribe>
          {/each}
        </tr>
      </Subscribe>
    {/each}
  </thead>
  <tbody {...$tableBodyAttrs}>
    {#each $rows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each row.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <td {...attrs}>
                <Render of={cell.render()} />
              </td>
            </Subscribe>
          {/each}
        </tr>
      </Subscribe>
    {/each}
  </tbody>
</table>
```

:::admonition type="info"
The view model extensions of a plugin are specified under its given name.

Each plugin may define different extensions for different table components, including [`HeaderRow`](../api/header-row.md)s, [`HeaderCell`](../api/header-cell.md)s, [`BodyRow`](../api/body-row.md)s, [`BodyCell`](../api/body-cell.md)s, and more.
:::

## Controlling plugin state

All plugins are driven by Svelte stores. Therefore, Svelte Headless Table plugins are programmatically controllable by default.

Plugins expose state via the `pluginStates` property on the view model. Thanks to Svelte stores, state can be easily subscribed to and modified!

<!-- prettier-ignore -->
```ts {7}
const {
  headerRows,
  rows,
  tableAttrs,
  tableBodyAttrs,
  pluginStates,
} = table.createViewModel(columns);
const { columnIdOrder } = pluginStates.colOrder;
$columnIdOrder = ['age', 'name'];
```

:::admonition type="info"
The state of a plugin is specified under its given name.
:::

## Final result

Putting it all together, we have a simple table with extended functionality!

Explore this example in the [REPL](https://svelte.dev/repl/ff08194b4de6407b8f96f29bf7c3f463?version=3.48.0).

<script>
  import PluginDemo from './PluginDemo.svelte';
</script>
<PluginDemo />

```svelte
<script>
  const data = readable([
    { name: 'Ada Lovelace', age: 21 },
    { name: 'Barbara Liskov', age: 52 },
    { name: 'Richard Hamming', age: 38 },
  ]);

  const table = createTable(data, {
    sort: addSortBy({ disableMultiSort: true }),
    colOrder: addColumnOrder(),
  });

  const columns = table.createColumns([
    table.column({
      header: 'Name',
      accessor: 'name',
      plugins: {
        sort: { invert: true },
      },
    }),
    table.column({
      header: 'Age',
      accessor: 'age',
    }),
  ]);

  const {
    headerRows,
    rows,
    tableAttrs,
    tableBodyAttrs,
    pluginStates,
  } = table.createViewModel(columns);
  const { columnIdOrder } = pluginStates.colOrder;
  $columnIdOrder = ['age', 'name'];
</script>

<table {...$tableAttrs}>
  <thead>
    {#each $headerRows as headerRow (headerRow.id)}
      <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each headerRow.cells as cell (cell.id)}
            <Subscribe
              attrs={cell.attrs()} let:attrs
              props={cell.props()} let:props
            >
              <th {...attrs} on:click={props.sort.toggle}>
                <Render of={cell.render()} />
                {#if props.sort.order === 'asc'}
                  ⬇️
                {:else if props.sort.order === 'desc'}
                  ⬆️
                {/if}
              </th>
            </Subscribe>
          {/each}
        </tr>
      </Subscribe>
    {/each}
  </thead>
  <tbody {...$tableBodyAttrs}>
    {#each $rows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <tr>
          {#each row.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <td {...attrs}>
                <Render of={cell.render()} />
              </td>
            </Subscribe>
          {/each}
        </tr>
      </Subscribe>
    {/each}
  </tbody>
</table>

<style>
  table {
    font-family: sans-serif;
    border-spacing: 0;
    border-top: 1px solid black;
    border-left: 1px solid black;
  }

  th,
  td {
    margin: 0;
    padding: 0.5rem;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
  }
</style>
```
