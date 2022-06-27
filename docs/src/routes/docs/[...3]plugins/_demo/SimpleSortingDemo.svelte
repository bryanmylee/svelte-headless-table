<script>
  import { readable } from 'svelte/store';
  import { createTable, Subscribe, Render } from 'svelte-headless-table';
  import { addSortBy } from 'svelte-headless-table/plugins';
  import { createSamples } from '$lib/utils/createSamples';

  const data = readable(createSamples(30));

  const table = createTable(data, {
    sort: addSortBy(),
  });

  const columns = table.createColumns([
    table.group({
      header: 'Name',
      columns: [
        table.column({
          header: 'First Name',
          accessor: 'firstName',
        }),
        table.column({
          header: 'Last Name',
          accessor: 'lastName',
        }),
      ],
    }),
    table.group({
      header: 'Info',
      columns: [
        table.column({
          header: 'Age',
          accessor: 'age',
        }),
        table.column({
          header: 'Status',
          accessor: 'status',
        }),
        table.column({
          header: 'Visits',
          accessor: 'visits',
        }),
        table.column({
          header: 'Profile Progress',
          accessor: 'progress',
        }),
      ],
    }),
  ]);

  const { headerRows, rows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);
  const { sortKeys } = pluginStates.sort;
</script>

<pre>$sortKeys = {JSON.stringify($sortKeys, null, 2)}</pre>

<div class="overflow-x-auto">
  <table class="demo my-0" {...$tableAttrs}>
    <thead>
      {#each $headerRows as headerRow (headerRow.id)}
        <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
          <tr {...rowAttrs}>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
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
</div>
