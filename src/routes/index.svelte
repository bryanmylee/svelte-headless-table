<script lang="ts">
	import { derived, readable } from 'svelte/store';
	import { Render, Subscribe, createTable, createRender } from '$lib';
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
	} from '$lib/plugins';
	import { mean, sum } from '$lib/utils/math';
	import { getShuffled } from './_getShuffled';
	import { createSamples } from './_createSamples';
	import Italic from './_Italic.svelte';
	import Profile from './_Profile.svelte';
	import Tick from './_Tick.svelte';
	import TextFilter from './_TextFilter.svelte';
	import NumberRangeFilter from './_NumberRangeFilter.svelte';
	import SelectFilter from './_SelectFilter.svelte';
	import ExpandIndicator from './_ExpandIndicator.svelte';
	import { getDistinct } from '$lib/utils/array';
	import SelectIndicator from './_SelectIndicator.svelte';

	const data = readable(createSamples(50, 2));

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
					([_rows, _pageRows]) => `Name (${_rows.length} records, ${_pageRows.length} in page)`
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
					derived(rows, (_rows) => ({ text: `Info (${_rows.length} samples)` }))
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
					header: createRender(Tick),
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

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, visibleColumns, pluginStates } =
		table.createViewModel(columns);

	const { groupByIds } = pluginStates.group;
	const { sortKeys } = pluginStates.sort;
	const { filterValues } = pluginStates.filter;
	const { filterValue } = pluginStates.tableFilter;
	const { selectedDataIds } = pluginStates.select;
	const { pageIndex, pageCount, pageSize, hasPreviousPage, hasNextPage } = pluginStates.page;
	const { expandedIds } = pluginStates.expand;
	const { columnIdOrder } = pluginStates.orderColumns;
	// $: $columnIdOrder = ['expanded', ...$groupByIds];
	const { hiddenColumnIds } = pluginStates.hideColumns;
	$hiddenColumnIds = ['progress'];
	const { columnWidths } = pluginStates.resize;
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

<table {...$tableAttrs}>
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
									<button on:click|stopPropagation={props.group.toggle}>
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
		background: lightgray;
	}

	.sorted {
		background: rgb(144, 191, 148);
	}

	.matches {
		font-weight: 700;
	}

	.group {
		background: rgb(144, 191, 148);
	}
	.aggregate {
		background: rgb(238, 212, 100);
	}
	.repeat {
		background: rgb(255, 139, 139);
	}

	.selected {
		background: rgb(148, 205, 255);
	}
</style>
