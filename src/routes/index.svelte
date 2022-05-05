<script lang="ts">
	import Render from '$lib/components/Render.svelte';
	import Subscribe from '$lib/components/Subscribe.svelte';
	import { createTable } from '$lib/createTable';
	import { getShuffled } from '$lib/utils/array';
	import { createSamples } from './_createSamples';
	import {
		matchFilter,
		numberRangeFilter,
		textPrefixFilter,
		useColumnFilters,
	} from '$lib/plugins/useColumnFilters';
	import { useColumnOrder } from '$lib/plugins/useColumnOrder';
	import { useHiddenColumns } from '$lib/plugins/useHiddenColumns';
	import { useSortBy } from '$lib/plugins/useSortBy';
	import { useTable } from '$lib/useTable';
	import { derived, writable } from 'svelte/store';
	import Italic from './_Italic.svelte';
	import Tick from './_Tick.svelte';
	import TextFilter from './_TextFilter.svelte';
	import { createRender } from '$lib/render';
	import NumberRangeFilter from './_NumberRangeFilter.svelte';
	import SelectFilter from './_SelectFilter.svelte';

	const data = writable(createSamples(100));

	const table = createTable(data, {
		sort: useSortBy(),
		filter: useColumnFilters(),
		orderColumns: useColumnOrder(),
		hideColumns: useHiddenColumns(),
	});

	const columns = table.createColumns([
		table.group({
			header: ({ rows }) => derived(rows, (_rows) => `Name (${_rows.length} samples)`),
			columns: [
				table.column({
					header: createRender(Italic, { text: 'First Name' }),
					accessor: 'firstName',
					plugins: {
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
					plugins: {},
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
					header: createRender(Tick),
					id: 'status',
					accessor: (item) => item.status,
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
							fn: numberRangeFilter,
							initValue: [null, null],
							render: ({ filterValue, values }) =>
								createRender(NumberRangeFilter, { filterValue, values }),
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

	const { visibleColumns, headerRows, rows, pluginStates } = useTable(table, { columns });

	const { sortKeys } = pluginStates.sort;
	const { filterValues } = pluginStates.filter;
	const { columnIdOrder } = pluginStates.orderColumns;
	$columnIdOrder = $visibleColumns.map((c) => c.id);
	const { hiddenColumnIds } = pluginStates.hideColumns;
	$hiddenColumnIds = ['progress'];
</script>

<h1>svelte-tables</h1>

<button on:click={() => ($columnIdOrder = getShuffled($columnIdOrder))}>Shuffle columns</button>

<table>
	<thead>
		{#each $headerRows as headerRow (headerRow.id)}
			<tr>
				{#each headerRow.cells as cell (cell.id)}
					<Subscribe to={cell} let:attrs let:props>
						<th {...attrs} on:click={props.sort.toggle}>
							<div>
								<Render of={cell.render()} />
								{#if props.sort.order === 'asc'}
									⬇️
								{:else if props.sort.order === 'desc'}
									⬆️
								{/if}
							</div>
							{#if props.filter !== undefined}
								<Render of={props.filter.render} />
							{/if}
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
					<Subscribe to={cell} let:attrs let:props>
						<td>
							<Render of={cell.render()} />
						</td>
					</Subscribe>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<pre>{JSON.stringify(
		{
			sortKeys: $sortKeys,
			filterValues: $filterValues,
			columnIdOrder: $columnIdOrder,
			hiddenColumnIds: $hiddenColumnIds,
		},
		null,
		2
	)}</pre>

<style global>
	h1,
	table {
		font-family: sans-serif;
	}

	table {
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
