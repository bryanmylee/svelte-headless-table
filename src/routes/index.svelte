<script lang="ts">
	import { derived, readable } from 'svelte/store';
	import { Render, Subscribe, createTable, createRender, useTable } from '$lib';
	import {
		useColumnFilters,
		useColumnOrder,
		useHiddenColumns,
		useSortBy,
		useTableFilter,
		usePagination,
		matchFilter,
		numberRangeFilter,
		textPrefixFilter,
	} from '$lib/plugins';
	import { getShuffled } from './_getShuffled';
	import { createSamples } from './_createSamples';
	import Italic from './_Italic.svelte';
	import Profile from './_Profile.svelte';
	import Tick from './_Tick.svelte';
	import TextFilter from './_TextFilter.svelte';
	import NumberRangeFilter from './_NumberRangeFilter.svelte';
	import SelectFilter from './_SelectFilter.svelte';

	const data = readable(createSamples(100));

	const table = createTable(data, {
		sort: useSortBy(),
		tableFilter: useTableFilter({
			includeHiddenColumns: true,
		}),
		filter: useColumnFilters(),
		orderColumns: useColumnOrder({
			initialColumnIdOrder: ['firstName', 'lastName'],
		}),
		hideColumns: useHiddenColumns(),
		page: usePagination(),
	});

	const columns = table.createColumns([
		table.column({
			header: 'Summary',
			id: 'summary',
			accessor: (i) => i,
			cell: (i: any) =>
				createRender(Profile, {
					age: i.age,
					progress: i.progress,
					name: `${i.firstName} ${i.lastName}`,
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
						sort: {
							disable: true,
						},
						tableFilter: {
							exclude: true,
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
							initialFilterValue: [null, null],
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
	const { filterValue } = pluginStates.tableFilter;
	$columnIdOrder = ['firstName', 'lastName'];
	const { hiddenColumnIds } = pluginStates.hideColumns;
	const { pageIndex, pageCount, pageSize, hasPreviousPage, hasNextPage } = pluginStates.page;
	$hiddenColumnIds = ['progress'];
</script>

<h1>svelte-headless-table</h1>

<button on:click={() => ($columnIdOrder = getShuffled($columnIdOrder))}>Shuffle columns</button>
<div>
	<button on:click={() => $pageIndex--} disabled={!$hasPreviousPage}>Previous page</button>
	{$pageIndex + 1} of {$pageCount}
	<button on:click={() => $pageIndex++} disabled={!$hasNextPage}>Next page</button>
	<label for="page-size">Page size</label>
	<input id="page-size" type="number" min={1} bind:value={$pageSize} />
</div>

<table>
	<thead>
		{#each $headerRows as headerRow (headerRow.id)}
			<tr>
				{#each headerRow.cells as cell (cell.id)}
					<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
						<th
							{...attrs}
							on:click={props.sort.toggle}
							class:sorted={props.sort.order !== undefined}
						>
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
		<tr>
			<th colspan={$visibleColumns.length}>
				<input type="text" bind:value={$filterValue} placeholder="Search all data..." />
			</th>
		</tr>
	</thead>
	<tbody>
		{#each $rows as row (row.id)}
			<tr>
				{#each row.cells as cell (cell.id)}
					<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
						<td
							{...attrs}
							class:sorted={props.sort.order !== undefined}
							class:matches={props.tableFilter.matches}
						>
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

<style>
	* {
		font-family: sans-serif;
	}
	pre {
		font-family: monospace;
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

	.sorted {
		background: rgb(144, 191, 148);
	}

	.matches {
		outline: 2px solid rgb(144, 191, 148);
	}
</style>
