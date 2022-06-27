<script lang="ts" context="module">
  export const getShuffled = (items: string[]): string[] => {
    items = [...items];
    const shuffled = [];
    while (items.length) {
      const rand = Math.floor(Math.random() * items.length);
      shuffled.push(items.splice(rand, 1)[0]);
    }
    return shuffled;
  };
</script>

<script lang="ts">
  import { readable } from 'svelte/store';
  import { createTable, Subscribe, Render } from 'svelte-headless-table';
  import { addColumnOrder } from 'svelte-headless-table/plugins';
  import { createSamples } from '$lib/utils/createSamples';

  const data = readable(createSamples(30));

  const table = createTable(data, {
    colOrder: addColumnOrder(),
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

  const { visibleColumns, headerRows, rows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);
  const { columnIdOrder } = pluginStates.colOrder;
  $columnIdOrder = $visibleColumns.map((c) => c.id);
</script>

<pre>$columnIdOrder = {JSON.stringify($columnIdOrder, null, 2)}</pre>

<button on:click={() => ($columnIdOrder = getShuffled($columnIdOrder))} class="demo"
  >Shuffle columns</button
>

<div class="overflow-x-auto">
  <table class="demo mb-0" {...$tableAttrs}>
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
</div>
