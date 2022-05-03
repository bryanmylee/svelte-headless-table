<script lang="ts">
	import Render from '$lib/components/Render.svelte';
	import Subscribe from '$lib/components/Subscribe.svelte';
	import { createTable } from '$lib/createTable';
	import { getShuffled } from '$lib/utils/array';
	import { sampleRows } from './_sampleRows';
	import { textPrefixMatch, useColumnFilters } from '$lib/plugins/useColumnFilters';
	import { useColumnOrder } from '$lib/plugins/useColumnOrder';
	import { useHiddenColumns } from '$lib/plugins/useHiddenColumns';
	import { useSortBy } from '$lib/plugins/useSortBy';
	import { useTable } from '$lib/useTable';
	import { writable } from 'svelte/store';
	import Italic from './_Italic.svelte';
	import Tick from './_Tick.svelte';
	import TextFilter from './_TextFilter.svelte';
	import { createRender } from '$lib/render';

	const data = writable(sampleRows);

	const table = createTable(data, {
		sort: useSortBy(),
		filter: useColumnFilters(),
		orderColumns: useColumnOrder(),
		hideColumns: useHiddenColumns(),
	});

	const columns = table.createColumns([
		table.group({
			header: createRender(Italic, { text: 'Name' }),
			columns: [
				table.column({
					header: createRender(Tick),
					accessor: 'firstName',
					plugins: {
						filter: {
							fn: textPrefixMatch,
							render: ({ filterValue }) => createRender(TextFilter, { filterValue }),
						},
					},
				}),
				table.column({
					header: 'Last Name',
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
					header: 'Status',
					id: 'status',
					accessor: (item) => item.status,
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

	const { visibleColumns, headerRows, bodyRows, pluginStates } = useTable(table, { columns });

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
								<Render of={cell.render} />
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
		{#each $bodyRows as bodyRow (bodyRow.id)}
			<tr>
				{#each bodyRow.cells as cell (cell.id)}
					<Subscribe to={cell} let:attrs let:props>
						<td>
							<Render of={cell.render} />
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
