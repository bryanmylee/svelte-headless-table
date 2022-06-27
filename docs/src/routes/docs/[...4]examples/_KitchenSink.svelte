<script lang="ts">
  import { derived, readable } from 'svelte/store';
  import { Render, Subscribe, createTable, createRender } from 'svelte-headless-table';
  import {
    addColumnFilters,
    addColumnOrder,
    addHiddenColumns,
    addSortBy,
    addTableFilter,
    addPagination,
    addExpandedRows,
    matchFilter,
    numberRangeFilter,
    textPrefixFilter,
    addSubRows,
    addGroupBy,
    addSelectedRows,
    addResizedColumns,
  } from 'svelte-headless-table/plugins';

  import { mean, sum } from '$lib/utils/math';
  import { getShuffled } from '$lib/utils/getShuffled';
  import { createSamples } from '$lib/utils/createSamples';
  import Italic from './_Italic.svelte';
  import Profile from './_Profile.svelte';
  import TextFilter from './_TextFilter.svelte';
  import NumberRangeFilter from './_NumberRangeFilter.svelte';
  import SelectFilter from './_SelectFilter.svelte';
  import ExpandIndicator from './_ExpandIndicator.svelte';
  import { getDistinct } from '$lib/utils/array';
  import SelectIndicator from './_SelectIndicator.svelte';

  const data = readable(createSamples(1000));

  const table = createTable(data, {
    subRows: addSubRows({
      children: 'children',
    }),
    filter: addColumnFilters(),
    tableFilter: addTableFilter({
      includeHiddenColumns: true,
    }),
    group: addGroupBy({
      initialGroupByIds: [],
    }),
    sort: addSortBy(),
    expand: addExpandedRows({
      initialExpandedIds: { 1: true },
    }),
    select: addSelectedRows({
      initialSelectedDataIds: { 1: true },
    }),
    orderColumns: addColumnOrder(),
    hideColumns: addHiddenColumns(),
    page: addPagination({
      initialPageSize: 20,
    }),
    resize: addResizedColumns(),
  });

  const columns = table.createColumns([
    table.display({
      id: 'selected',
      header: '',
      cell: ({ row }, { pluginStates }) => {
        const { isSelected, isSomeSubRowsSelected } = pluginStates.select.getRowState(row);
        return createRender(SelectIndicator, {
          isSelected,
          isSomeSubRowsSelected,
        });
      },
      plugins: {
        resize: {
          disable: true,
        },
      },
    }),
    table.display({
      id: 'expanded',
      header: '',
      cell: ({ row }, { pluginStates }) => {
        const { isExpanded, canExpand, isAllSubRowsExpanded } =
          pluginStates.expand.getRowState(row);
        return createRender(ExpandIndicator, {
          isExpanded,
          canExpand,
          isAllSubRowsExpanded,
          depth: row.depth,
        });
      },
      plugins: {
        resize: {
          disable: true,
        },
      },
    }),
    table.column({
      header: 'Summary',
      id: 'summary',
      accessor: (item) => item,
      cell: ({ value }) =>
        createRender(Profile, {
          age: value.age,
          progress: value.progress,
          name: `${value.firstName} ${value.lastName}`,
        }),
      plugins: {
        sort: {
          getSortValue: (i) => i.lastName,
        },
        tableFilter: {
          getFilterValue: (i) => i.progress,
        },
      },
    }),
    table.group({
      header: ({ rows, pageRows }) =>
        derived(
          [rows, pageRows],
          ([_rows, _pageRows]) => `Name (${_rows.length} records, ${_pageRows.length} in page)`,
        ),
      columns: [
        table.column({
          header: createRender(Italic, { text: 'First Name' }),
          accessor: 'firstName',
          plugins: {
            group: {
              getAggregateValue: (values) => getDistinct(values).length,
              cell: ({ value }) => `${value} unique`,
            },
            sort: {
              invert: true,
            },
            filter: {
              fn: textPrefixFilter,
              render: ({ filterValue, values }) =>
                createRender(TextFilter, { filterValue, values }),
            },
          },
        }),
        table.column({
          header: () => 'Last Name',
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
      header: ({ rows }) =>
        createRender(
          Italic,
          derived(rows, (_rows) => ({ text: `Info (${_rows.length} samples)` })),
        ),
      columns: [
        table.column({
          header: 'Age',
          accessor: 'age',
          plugins: {
            group: {
              getAggregateValue: (values) => mean(values),
              cell: ({ value }) => `${(value as number).toFixed(2)} (avg)`,
            },
            resize: {
              minWidth: 50,
              initialWidth: 100,
              maxWidth: 200,
            },
          },
        }),
        table.column({
          header: 'Status',
          id: 'status',
          accessor: (item) => item.status,
          plugins: {
            sort: {
              disable: true,
            },
            filter: {
              fn: matchFilter,
              render: ({ filterValue, preFilteredValues }) =>
                createRender(SelectFilter, { filterValue, preFilteredValues }),
            },
            tableFilter: {
              exclude: true,
            },
            resize: {
              disable: true,
            },
          },
        }),
        table.column({
          header: 'Visits',
          accessor: 'visits',
          plugins: {
            group: {
              getAggregateValue: (values) => sum(values),
              cell: ({ value }) => `${value} (total)`,
            },
            filter: {
              fn: numberRangeFilter,
              initialFilterValue: [null, null],
              render: ({ filterValue, values }) =>
                createRender(NumberRangeFilter, { filterValue, values }),
            },
          },
        }),
        table.column({
          header: 'Profile Progress',
          accessor: 'progress',
          plugins: {
            group: {
              getAggregateValue: (values) => mean(values),
              cell: ({ value }) => `${(value as number).toFixed(2)} (avg)`,
            },
          },
        }),
      ],
    }),
  ]);

  const {
    flatColumns,
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    visibleColumns,
    pluginStates,
  } = table.createViewModel(columns);
  const ids = flatColumns.map((c) => c.id);

  const { groupByIds } = pluginStates.group;
  const { sortKeys } = pluginStates.sort;
  const { filterValues } = pluginStates.filter;
  const { filterValue } = pluginStates.tableFilter;
  const { selectedDataIds } = pluginStates.select;
  const { pageIndex, pageCount, pageSize, hasPreviousPage, hasNextPage } = pluginStates.page;
  const { expandedIds } = pluginStates.expand;
  const { columnIdOrder } = pluginStates.orderColumns;
  $columnIdOrder = ids;
  const { hiddenColumnIds } = pluginStates.hideColumns;
  let hideForId = Object.fromEntries(ids.map((id) => [id, false]));
  $: $hiddenColumnIds = Object.entries(hideForId)
    .filter(([, hide]) => hide)
    .map(([id]) => id);
  const { columnWidths } = pluginStates.resize;
</script>

<h2>Hidden columns</h2>

<div style:display="grid" style:grid-template-columns="repeat(3, 1fr)">
  {#each ids as id}
    <div class="flex items-center gap-4">
      <input id="hide-{id}" type="checkbox" bind:checked={hideForId[id]} />
      <label for="hide-{id}">{id}</label>
    </div>
  {/each}
</div>

<h2>Pagination</h2>

<div>
  <button on:click={() => $pageIndex--} disabled={!$hasPreviousPage} class="demo"
    >Previous page</button
  >
  {$pageIndex + 1} of {$pageCount}
  <button on:click={() => $pageIndex++} disabled={!$hasNextPage} class="demo">Next page</button>
</div>
<div style:margin-top="1rem">
  <label for="page-size">Page size</label>
  <input id="page-size" type="number" min={1} bind:value={$pageSize} class="demo" />
</div>

<h2>Column order</h2>

<button on:click={() => ($columnIdOrder = getShuffled($columnIdOrder))} class="demo"
  >Shuffle columns</button
>

<div class="overflow-x-auto">
  <table {...$tableAttrs} class="demo">
    <thead>
      {#each $headerRows as headerRow (headerRow.id)}
        <Subscribe attrs={headerRow.attrs()} let:attrs>
          <tr {...attrs}>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                <th
                  {...attrs}
                  on:click={props.sort.toggle}
                  class:sorted={props.sort.order !== undefined}
                  use:props.resize
                >
                  <div>
                    <Render of={cell.render()} />
                    {#if props.sort.order === 'asc'}
                      ⬇️
                    {:else if props.sort.order === 'desc'}
                      ⬆️
                    {/if}
                  </div>
                  {#if !props.group.disabled}
                    <button on:click|stopPropagation={props.group.toggle} class="demo">
                      {#if props.group.grouped}
                        ungroup
                      {:else}
                        group
                      {/if}
                    </button>
                  {/if}
                  {#if props.filter !== undefined}
                    <Render of={props.filter.render} />
                  {/if}
                  {#if !props.resize.disabled}
                    <div class="resizer" on:click|stopPropagation use:props.resize.drag />
                  {/if}
                </th>
              </Subscribe>
            {/each}
          </tr>
        </Subscribe>
      {/each}
      <tr>
        <th colspan={$visibleColumns.length}>
          <input type="text" bind:value={$filterValue} placeholder="Search all data..." />
        </th>
      </tr>
    </thead>
    <tbody {...$tableBodyAttrs}>
      {#each $pageRows as row (row.id)}
        <Subscribe attrs={row.attrs()} let:attrs rowProps={row.props()} let:rowProps>
          <tr {...attrs} class:selected={rowProps.select.selected}>
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
                <td
                  {...attrs}
                  class:sorted={props.sort.order !== undefined}
                  class:matches={props.tableFilter.matches}
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

<pre>{JSON.stringify(
    {
      groupByIds: $groupByIds,
      sortKeys: $sortKeys,
      filterValues: $filterValues,
      selectedDataIds: $selectedDataIds,
      columnIdOrder: $columnIdOrder,
      hiddenColumnIds: $hiddenColumnIds,
      expandedIds: $expandedIds,
      columnWidths: $columnWidths,
    },
    null,
    2,
  )}</pre>

<style>
  th {
    position: relative;
  }

  th .resizer {
    position: absolute;
    top: 0;
    bottom: 0;
    right: -4px;
    width: 8px;
    z-index: 1;
    background: rgba(200, 200, 200, 0.5);
    cursor: col-resize;
  }
  .sorted {
    background: rgb(144, 191, 148, 0.5);
  }
  .matches {
    font-weight: 700;
  }
  .group {
    background: rgb(144, 191, 148, 0.5);
  }
  .aggregate {
    background: rgb(238, 212, 100, 0.5);
  }
  .repeat {
    background: rgb(255, 139, 139, 0.5);
  }
  .selected {
    background: rgb(148, 205, 255, 0.5);
  }
</style>
