<script lang="ts" context="module">
  const textPrefixFilter: ColumnFilterFn = ({ filterValue, value }) => {
    return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
  };
  const minFilter: ColumnFilterFn = ({ filterValue, value }) => {
    if (typeof value !== 'number' || typeof filterValue !== 'number') return true;
    return filterValue <= value;
  };
  const numberRangeFilter: ColumnFilterFn = ({ filterValue, value }) => {
    if (!Array.isArray(filterValue) || typeof value !== 'number') return true;
    const [min, max] = filterValue;
    if (min === null && max === null) return true;
    if (min === null) return value <= max;
    if (max === null) return min <= value;

    return min <= value && value <= max;
  };
  const matchFilter: ColumnFilterFn = ({ filterValue, value }) => {
    if (filterValue === undefined) return true;
    return filterValue === value;
  };
</script>

<script lang="ts">
  import { readable } from 'svelte/store';
  import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
  import { addColumnFilters } from 'svelte-headless-table/plugins';
  import type { ColumnFilterFn } from 'svelte-headless-table/plugins';
  import TextFilter from './TextFilter.svelte';
  import SelectFilter from './SelectFilter.svelte';
  import NumberRangeFilter from './NumberRangeFilter.svelte';
  import SliderFilter from './SliderFilter.svelte';
  import { createSamples } from '$lib/utils/createSamples';
  import Bold from '../../[...2]api/[...3]create-columns/Bold.svelte';

  const data = readable(createSamples(30));

  const table = createTable(data, {
    filter: addColumnFilters(),
  });

  const columns = table.createColumns([
    table.group({
      header: 'Name',
      columns: [
        table.column({
          header: 'First Name',
          accessor: 'firstName',
          plugins: {
            filter: {
              fn: textPrefixFilter,
              initialFilterValue: '',
              render: ({ filterValue, values, preFilteredValues }) =>
                createRender(TextFilter, { filterValue, values, preFilteredValues }),
            },
          },
        }),
        table.column({
          header: 'Last Name',
          accessor: 'lastName',
          plugins: {
            filter: {
              fn: textPrefixFilter,
              initialFilterValue: '',
              render: ({ filterValue, values, preFilteredValues }) =>
                createRender(TextFilter, { filterValue, values, preFilteredValues }),
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
            filter: {
              fn: numberRangeFilter,
              initialFilterValue: [null, null],
              render: ({ filterValue, values }) =>
                createRender(NumberRangeFilter, { filterValue, values }),
            },
          },
        }),
        table.column({
          header: 'Status',
          accessor: 'status',
          plugins: {
            filter: {
              fn: matchFilter,
              render: ({ filterValue, preFilteredValues }) =>
                createRender(SelectFilter, { filterValue, preFilteredValues }),
            },
          },
        }),
        table.column({
          header: 'Visits',
          accessor: 'visits',
          plugins: {
            filter: {
              fn: minFilter,
              initialFilterValue: 0,
              render: ({ filterValue, preFilteredValues }) =>
                createRender(SliderFilter, { filterValue, preFilteredValues }),
            },
          },
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
  const { filterValues } = pluginStates.filter;
</script>

<pre>$filterValues = {JSON.stringify($filterValues, null, 2)}</pre>

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
                  {#if props.filter?.render}
                    <div>
                      <Render of={props.filter.render} />
                    </div>
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
              <td><Render of={cell.render()} /></td>
            {/each}
          </tr>
        </Subscribe>
      {/each}
    </tbody>
  </table>
</div>
