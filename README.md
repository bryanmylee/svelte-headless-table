<p align="center">
  <img src="https://user-images.githubusercontent.com/42545742/169733428-295e2678-e509-4175-aeb3-cb3a9c9894e1.svg" alt="svelte-headless-table" width="400px"/>
</p>
<h1 align="center">Svelte Headless Table</h1>

<div align="center">

[![npm version](http://img.shields.io/npm/v/svelte-headless-table.svg)](https://www.npmjs.com/package/svelte-headless-table)
[![npm downloads](https://img.shields.io/npm/dm/svelte-headless-table.svg)](https://www.npmjs.com/package/svelte-headless-table)
![license](https://img.shields.io/npm/l/svelte-headless-table)
![build](https://img.shields.io/github/workflow/status/bryanmylee/svelte-headless-table/publish)
[![coverage](https://coveralls.io/repos/github/bryanmylee/svelte-headless-table/badge.svg?branch=main)](https://coveralls.io/github/bryanmylee/svelte-headless-table?branch=main)

</div>

**Unopinionated and extensible data tables for Svelte**

> Build and design powerful datagrid experiences while retaining 100% control over styles and markup.

Visit the [documentation](https://svelte-headless-table.bryanmylee.com/) for code examples and API reference, and get started with the [quick start guide](https://svelte-headless-table.bryanmylee.com/docs/getting-started/quick-start)!

Svelte Headless Table has **full TypeScript support** and is compatible with **SvelteKit**!

## Why Svelte Headless Table?

### Headless

Beauty is subjective – everybody wants components to match their own theme! That's why Svelte Headless Table is **headless** by design. You are in full control of how your table looks, down to the very last component, class, and style.

### Declarative

Just describe how you want your tables to behave and let Svelte Headless Table handle the rest! It is designed with full TypeScript support and an intuitive API that lets you get started immediately.

### Extensible

Svelte Headless Table comes with a stable plugin system that allows you to transform and modify every step under the hood. If you want extra functionality, you can build it!

### Svelte-Native

Svelte Headless Table is designed to work **seamlessly** with Svelte. If you love Svelte, you will love Svelte Headless Table.

## The Plugin System

Svelte Headless Table is designed with extensibility in mind. Its complex features are provided by an extensive suite of plugins.

Svelte Headless Table allows you to perform complex sorting, filtering, grouping, pagination, and more.

### Plugin roadmap

- [x] [addSortBy](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-sort-by)
- [x] [addColumnFilters](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-column-filters)
- [x] [addTableFilter](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-table-filter)
- [x] [addColumnOrder](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-column-order)
- [x] [addHiddenColumns](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-hidden-columns)
- [x] [addPagination](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-pagination)
- [x] [addSubRows](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-sub-rows)
- [x] [addGroupBy](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-group-by)
- [x] [addExpandedRows](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-expanded-rows)
- [ ] addRowSelect
- [ ] addResizeColumns
- [ ] addEditable
- [ ] addRowLabel

## Examples

```svelte
<script>
  const data = readable([
    { name: 'Ada Lovelace', age: 21 },
    { name: 'Barbara Liskov', age: 52 },
    { name: 'Richard Hamming', age: 38 },
  ]);

  const table = createTable(data);

  const columns = table.createColumns([
    table.column({
      header: 'Name',
      accessor: 'name',
    }),
    table.column({
      header: 'Age',
      accessor: 'age',
    }),
  ]);

  const { headerRows, rows } = table.createViewModel(columns);
</script>

<table>
  <thead>
    {#each $headerRows as headerRow (headerRow.id)}
      <tr>
        {#each headerRow.cells as cell (cell.id)}
          <Subscribe attrs={cell.attrs()} let:attrs>
            <th {...attrs}>
              <Render of={cell.render()} />
            </th>
          </Subscribe>
        {/each}
      </tr>
    {/each}
  </thead>
  <tbody>
    {#each $rows as row (row.id)}
      <tr>
        {#each row.cells as cell (cell.id)}
          <Subscribe attrs={cell.attrs()} let:attrs>
            <td {...attrs}>
              <Render of={cell.render()} />
            </td>
          </Subscribe>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
```

For more complex examples with advanced features, visit the [documentation site](https://svelte-headless-table.bryanmylee.com/docs/plugins/overview).
