<script>
  import { derived, readable } from 'svelte/store';
  import { createTable, Subscribe, Render } from 'svelte-headless-table';
  import { addPagination } from 'svelte-headless-table/plugins';
  import { createSamples } from '$lib/utils/createSamples';

  const data = readable(createSamples(100));

  const table = createTable(data, {
    page: addPagination(),
  });

  const columns = table.createColumns([
    table.group({
      header: ({ rows, pageRows }) =>
        derived([pageRows], ([_pageRows]) => `Name (${_pageRows.length} on page)`),
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

  const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);
  const { pageIndex, pageCount, pageSize, hasNextPage, hasPreviousPage } = pluginStates.page;
</script>

<pre>{JSON.stringify(
    {
      $pageIndex: $pageIndex,
      $pageCount: $pageCount,
      $pageSize: $pageSize,
    },
    null,
    2,
  )}</pre>

<div class="mb-4 flex gap-4 items-baseline">
  <button on:click={() => $pageIndex--} disabled={!$hasPreviousPage} class="demo"
    >Previous page</button
  >
  {$pageIndex + 1} out of {$pageCount}
  <button on:click={() => $pageIndex++} disabled={!$hasNextPage} class="demo">Next page</button>
</div>
<label for="page-size">Page size</label>
<input id="page-size" type="number" min={1} bind:value={$pageSize} class="demo mb-4" />

<div class="overflow-x-auto">
  <table class="demo my-0" {...$tableAttrs}>
    <thead>
      {#each $headerRows as headerRow (headerRow.id)}
        <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
          <tr {...rowAttrs}>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
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
      {#each $pageRows as row (row.id)}
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
