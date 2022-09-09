<script lang="ts">
  import { derived, readable } from 'svelte/store';
  import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
  import { addGroupBy, addExpandedRows, addColumnOrder } from 'svelte-headless-table/plugins';
  import { createSamples } from '$lib/utils/createSamples';
  import ExpandIndicator from './ExpandIndicator.svelte';
  import { getDistinct } from './SelectFilter.svelte';
  import { mean, sum } from '$lib/utils/math';

  const data = readable(createSamples(30));

  const table = createTable(data, {
    group: addGroupBy(),
    expand: addExpandedRows(),
    colOrder: addColumnOrder(),
  });

  const columns = table.createColumns([
    table.display({
      id: 'expanded',
      header: '',
      cell: ({ row }, { pluginStates }) => {
        const { isExpanded, canExpand, isAllSubRowsExpanded } =
          pluginStates.expand.getRowState(row);
        return createRender(ExpandIndicator, {
          depth: row.depth,
          isExpanded,
          canExpand,
          isAllSubRowsExpanded,
        });
      },
    }),
    table.group({
      header: (_, { rows }) => derived([rows], ([_rows]) => `Name (${_rows.length} users)`),
      columns: [
        table.column({
          header: 'First Name',
          accessor: 'firstName',
          plugins: {
            group: {
              getAggregateValue: (values) => getDistinct(values).length,
              cell: ({ value }) => `${value} unique`,
            },
          },
        }),
        table.column({
          header: 'Last Name',
          accessor: 'lastName',
          plugins: {
            group: {
              getAggregateValue: (values) => getDistinct(values).length,
              cell: ({ value }) => `${value} unique`,
            },
          },
        }),
      ],
    }),
    table.group({
      header: 'Info',
      columns: [
        table.column({
          header: 'Age',
          accessor: 'age',
          plugins: {
            group: {
              getAggregateValue: (values) => mean(values),
              cell: ({ value }) => `${(value as number).toFixed(1)} (avg)`,
            },
          },
        }),
        table.column({
          header: 'Status',
          accessor: 'status',
        }),
        table.column({
          header: 'Visits',
          accessor: 'visits',
          plugins: {
            group: {
              getAggregateValue: (values) => sum(values),
              cell: ({ value }) => `${value} (total)`,
            },
          },
        }),
        table.column({
          header: 'Profile Progress',
          accessor: 'progress',
          plugins: {
            group: {
              getAggregateValue: (values) => mean(values),
              cell: ({ value }) => `${(value as number).toFixed(1)} (avg)`,
            },
          },
        }),
      ],
    }),
  ]);

  const { headerRows, rows, tableAttrs, tableBodyAttrs, pluginStates } =
    table.createViewModel(columns);
  const { groupByIds } = pluginStates.group;
</script>

<pre>{JSON.stringify(
    {
      $groupByIds: $groupByIds,
    },
    null,
    2,
  )}</pre>

<div class="overflow-x-auto">
  <table class="demo my-0" {...$tableAttrs}>
    <thead>
      {#each $headerRows as headerRow (headerRow.id)}
        <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
          <tr>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                <th {...attrs}>
                  <Render of={cell.render()} />
                  {#if !props.group.disabled}
                    <button on:click={props.group.toggle} class="demo">
                      {#if props.group.grouped}
                        ungroup
                      {:else}
                        group
                      {/if}
                    </button>
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
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                <td
                  {...attrs}
                  class:group={props.group.grouped}
                  class:aggregate={props.group.aggregated}
                  class:repeat={props.group.repeated}
                >
                  {#if !props.group.repeated}
                    <Render of={cell.render()} />
                  {/if}
                </td>
              </Subscribe>
            {/each}
          </tr>
        </Subscribe>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .group {
    background: rgb(144, 191, 148);
  }
  .aggregate {
    background: rgb(238, 212, 100);
  }
  .repeat {
    background: rgb(255, 139, 139);
  }
</style>
