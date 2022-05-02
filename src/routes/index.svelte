<script lang="ts">
	import { writable } from 'svelte/store';
	import { useTable } from '$lib/useTable';
	import { sampleRows } from './_sampleRows';
	import Render from '$lib/components/Render.svelte';
	import { getShuffled } from '$lib/utils/array';
	import { useSortBy } from '$lib/plugins/useSortBy';
	import Subscribe from '$lib/components/Subscribe.svelte';
	import { useColumnOrder } from '$lib/plugins/useColumnOrder';
	import { useHiddenColumns } from '$lib/plugins/useHiddenColumns';
	import { createTable } from '$lib/createTable';

	const data = writable(sampleRows);
	const table = createTable({ data });
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
					id: 'profileProgress',
				}),
			],
		}),
	]);

	const { visibleColumns, headerRows, bodyRows, pluginStates } = useTable(
		{
			data,
			columns,
		},
		{
			sort: useSortBy(),
			columnOrder: useColumnOrder(),
			hiddenColumns: useHiddenColumns(),
		}
	);
	const { sortKeys } = pluginStates.sort;
	const { columnIdOrder } = pluginStates.columnOrder;
	$columnIdOrder = $visibleColumns.map((c) => c.id);
	const { hiddenColumnIds } = pluginStates.hiddenColumns;
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
						<th {...attrs} use:cell.events>
							<Render of={cell} />
							{#if props.sort.order === 'asc'}
								⬇️
							{:else if props.sort.order === 'desc'}
								⬆️
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
							<Render of={cell} />
						</td>
					</Subscribe>
				{/each}
			</tr>
		{/each}
	</tbody>
	<tfoot>
		<!-- {#each $table.footerRows as footerRow} -->
		<tr>
			<!-- {#each footerRow.cells as cell} -->
			<td>
				<!-- <Render {...cell.render()} /> -->
			</td>
			<!-- {/each} -->
		</tr>
		<!-- {/each} -->
	</tfoot>
</table>

<pre>{JSON.stringify(
		{
			columnIdOrder: $columnIdOrder,
			hiddenColumnIds: $hiddenColumnIds,
			sortKeys: $sortKeys,
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
