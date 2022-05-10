<script lang="ts">
	import { derived, readable } from 'svelte/store';
	import { Render, Subscribe, createTable, createRender, useTable } from '$lib';
	import {
		useColumnFilters,
		useColumnOrder,
		useHiddenColumns,
		useSortBy,
		matchFilter,
		numberRangeFilter,
		textPrefixFilter,
	} from '$lib/plugins';
	import { getShuffled } from './_getShuffled';
	import { createSamples } from './_createSamples';
	import Italic from './_Italic.svelte';
	import Tick from './_Tick.svelte';
	import TextFilter from './_TextFilter.svelte';
	import NumberRangeFilter from './_NumberRangeFilter.svelte';
	import SelectFilter from './_SelectFilter.svelte';

	const data = readable(createSamples(10));

	const table = createTable(data, {
		sort: useSortBy(),
		filter: useColumnFilters(),
		orderColumns: useColumnOrder({
			initialColumnIdOrder: ['firstName', 'lastName'],
		}),
		hideColumns: useHiddenColumns(),
	});

	const columns = table.createColumns([
		table.column({
			header: 'Item',
			id: 'item',
			accessor: (i) => i,
			cell: (i) => JSON.stringify(i),
			plugins: {
				sort: {
					getSortValue: (i) => i.lastName,
				},
			},
		}),
		table.group({
			header: ({ rows }) => derived(rows, (_rows) => `Name (${_rows.length} samples)`),
			columns: [
				table.column({
					header: createRender(Italic, { text: 'First Name' }),
					accessor: 'firstName',
					plugins: {
						sort: {
							invert: true,
						},
						filter: {
							match: textPrefixFilter,
							render: ({ filterValue, values }) =>
								createRender(TextFilter, { filterValue, values }),
						},
					},
				}),
				table.column({
					header: () => 'Last Name',
					accessor: 'lastName',
					plugins: {
						sort: {
							disable: true,
						},
					},
				}),
			],
		}),
		table.group({
			header: ({ rows }) =>
				createRender(
					Italic,
					derived(rows, (_rows) => ({ text: `Info (${_rows.length} samples)` }))
				),
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
							match: matchFilter,
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
							match: numberRangeFilter,
							initFilterValue: [null, null],
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

	const { visibleColumns, headerRows, rows, pluginStates } = useTable(table, columns);

	const { sortKeys } = pluginStates.sort;
	const { filterValues } = pluginStates.filter;
	const { columnIdOrder } = pluginStates.orderColumns;
	// $columnIdOrder = $visibleColumns.slice(3, 5).map((c) => c.id);
	$columnIdOrder = ['firstName', 'lastName'];
	const { hiddenColumnIds } = pluginStates.hideColumns;
	$hiddenColumnIds = ['progress'];
</script>

<h1>svelte-headless-table</h1>

<button on:click={() => ($columnIdOrder = getShuffled($columnIdOrder))}>Shuffle columns</button>

<table>
	<thead>
		{#each $headerRows as headerRow (headerRow.id)}
			<tr>
				{#each headerRow.cells as cell (cell.id)}
					<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
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
					<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
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
