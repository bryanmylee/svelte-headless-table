<p align="center">
  <img src="https://user-images.githubusercontent.com/42545742/169733428-295e2678-e509-4175-aeb3-cb3a9c9894e1.svg" alt="svelte-headless-table" width="400px"/>
</p>
<h1 align="center">Svelte Headless Table</h1>

<div align="center">

[![npm version](http://img.shields.io/npm/v/svelte-headless-table.svg)](https://www.npmjs.com/package/svelte-headless-table)
[![npm downloads](https://img.shields.io/npm/dm/svelte-headless-table.svg)](https://www.npmjs.com/package/svelte-headless-table)
![license](https://img.shields.io/npm/l/svelte-headless-table)
![build](https://img.shields.io/github/actions/workflow/status/bryanmylee/svelte-headless-table/publish.yml)

<!--[![coverage](https://coveralls.io/repos/github/bryanmylee/svelte-headless-table/badge.svg?branch=main)](https://coveralls.io/github/bryanmylee/svelte-headless-table?branch=main)-->

</div>

**Unopinionated and extensible data tables for Svelte**

> Build and design powerful datagrid experiences while retaining 100% control over styles and markup.

Visit the [documentation](https://svelte-headless-table.bryanmylee.com/) for code examples and API reference, and get started with the [quick start guide](https://svelte-headless-table.bryanmylee.com/docs/getting-started/quick-start)!

## Why Svelte Headless Table?

Svelte Headless Table is designed to work **seamlessly** with Svelte. If you love Svelte, you will love Svelte Headless Table.

- **Full TypeScript support**
- Compatible with **SvelteKit** and SSR
- Manage state with Svelte stores
- Headless and fully customizable
- Intuitive column-first declarative model
- Highly performant
- Feature-rich

## All the features you could ever need!

Svelte Headless Table comes with an extensive suite of plugins.

Easily extend Svelte Headless Table with complex **sorting**, **filtering**, **grouping**, **pagination**, and much more.

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
- [x] [addSelectedRows](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-selected-rows)
- [x] [addResizedColumns](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-resized-columns)
- [x] [addGridLayout](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-grid-layout)

## Examples

<!-- prettier-ignore -->
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

  const {
    headerRows,
    rows,
    tableAttrs,
    tableBodyAttrs,
  } = table.createViewModel(columns);
</script>

<table {...$tableAttrs}>
  <thead>
    {#each $headerRows as headerRow (headerRow.id)}
      <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
        <tr {...rowAttrs}>
          {#each headerRow.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <th {...attrs}>
                <Render of={cell.render()} />
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

For more complex examples with advanced features, visit the [documentation site](https://svelte-headless-table.bryanmylee.com/docs/plugins/overview).
