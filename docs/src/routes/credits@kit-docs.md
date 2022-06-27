---
title: Credits
description: Contributors to Svelte Headless Table
---

# {$frontmatter.title}

<script lang="ts">
  import { readable } from 'svelte/store';
  import { createTable, createRender, Render, Subscribe } from 'svelte-headless-table';
  import { addSortBy } from 'svelte-headless-table/plugins';
  import CreditsAnchor from './_CreditsAnchor.svelte';
  import CaretDownIcon from '~icons/ic/round-keyboard-arrow-down';
  
  const data = readable([
    {
      name: 'React Table',
      description: 'Svelte Headless Table takes inspiration for its column model from React Table.',
      url: 'https://react-table.tanstack.com/',
    },
    {
      name: 'KitDocs',
      description: 'The documentation site is built with KitDocs.',
      url: 'https://kit-docs.svelteness.dev/docs/getting-started/introduction',
    },
  ]);

  const table = createTable(data, {
    sort: addSortBy(),
  });

  const columns = table.createColumns([
    table.column({
      header: 'Name',
      id: 'name',
      accessor: item => item,
      cell: ({ value: { name, url }}) => createRender(CreditsAnchor, { label: name, href: url }),
      plugins: {
        sort: {
          getSortValue: ({ name }) => name,
        }
      },
    }),
    table.column({
      header: 'Description',
      accessor: 'description',
    }),
  ]);
  const { headerRows, rows } = table.createViewModel(columns);
</script>

<table>
  <thead>
    {#each $headerRows as headerRow (headerRow.id)}
      <tr>
        {#each headerRow.cells as cell (cell.id)}
          <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
            <th {...attrs} on:click={props.sort.toggle}>
              <div class="flex items-center">
                <Render of={cell.render()} />
                {#if props.sort.order !== undefined}
                  <CaretDownIcon
                    class="transition-transform {props.sort.order === 'desc' && '-scale-y-100'}"
                  />
                {/if}
              </div>
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

:::admonition type="note"

The credits are also managed by Svelte Headless Table!

View the code [here](https://svelte.dev/repl/4bf807f8def64c3e97c3c062641358b2?version=3.48.0).

:::
