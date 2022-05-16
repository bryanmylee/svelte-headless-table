<script lang="ts">
	import { derived, readable } from 'svelte/store';
	import { Render, Subscribe, createTable, createRender } from '$lib';
	import {
		useColumnFilters,
		useColumnOrder,
		useHiddenColumns,
		useSortBy,
		useTableFilter,
		usePagination,
		useExpandedRows,
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
	import ExpandIndicator from './_ExpandIndicator.svelte';

	const data = readable(createSamples(10, 5, 5));

	const table = createTable(data, {
		sort: useSortBy(),
		filter: useColumnFilters(),
		tableFilter: useTableFilter({
			includeHiddenColumns: true,
		}),
		expand: useExpandedRows({
			children: 'children',
			initialExpandedIds: { 1: true },
		}),
		orderColumns: useColumnOrder(),
		hideColumns: useHiddenColumns(),
		page: usePagination({
			initialPageSize: 20,
		}),
	});

	const columns = table.createColumns([
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
					([_rows, _pageRows]) => `Name (${_rows.length} records, ${_pageRows.length} in page)`
				),
			columns: [
				table.column({
					header: createRender(Italic, { text: 'First Name' }),
					accessor: 'firstName',
					plugins: {
						sort: {
							invert: true,
						},
						tableFilter: {
							exclude: true,
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

	const { visibleColumns, headerRows, pageRows, pluginStates } = table.createViewModel(columns);

	const { sortKeys } = pluginStates.sort;
	const { filterValues } = pluginStates.filter;
	const { filterValue } = pluginStates.tableFilter;
	const { pageIndex, pageCount, pageSize, hasPreviousPage, hasNextPage } = pluginStates.page;
	const { columnIdOrder } = pluginStates.orderColumns;
	const { hiddenColumnIds } = pluginStates.hideColumns;
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
		{#each $pageRows as row (row.id)}
			<tr id={row.id}>
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
