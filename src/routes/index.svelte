<script lang="ts">
	import { writable } from 'svelte/store';
	import { column, createColumns, group } from '$lib/columns';
	import { useTable } from '$lib/useTable';
	import { sampleRows, type SampleRow } from './_sampleRows';
	import Render from '$lib/components/Render.svelte';
	import { getShuffled } from '$lib/utils/array';
	import { useSortBy } from '$lib/plugins/useSortBy';
	import ExtraProps from '$lib/components/ExtraProps.svelte';
	import { useColumnOrder } from '$lib/plugins/useColumnOrder';

	const data = writable(sampleRows);
	const columns = createColumns<SampleRow>([
		group({
			header: 'Name',
			columns: [
				column({
					header: 'First Name',
					accessor: 'firstName',
				}),
				column({
					header: 'Last Name',
					accessor: 'lastName',
				}),
			],
		}),
		group({
			header: 'Info',
			columns: [
				column({
					header: 'Age',
					accessor: 'age',
				}),
				column({
					header: 'Status',
					accessor: 'status',
				}),
				column({
					header: 'Visits',
					accessor: 'visits',
				}),
				column({
					header: 'Profile Progress',
					accessor: 'progress',
				}),
			],
		}),
	]);

	const { flatColumns, headerRows, bodyRows, pluginStates } = useTable(
		{
			data,
			columns,
		},
		{
			sort: useSortBy(),
			columnOrder: useColumnOrder(),
		}
	);
	const { sortKeys } = pluginStates.sort;
	const { columnOrder } = pluginStates.columnOrder;
	$columnOrder = $flatColumns.map((c) => c.id);
</script>

<h1>svelte-tables</h1>

<button on:click={() => ($columnOrder = getShuffled($columnOrder))}>Shuffle columns</button>

<table>
	<thead>
		{#each $headerRows as headerRow (headerRow.id)}
			<tr>
				{#each headerRow.cells as cell (cell.id)}
					<th {...cell.attrs()} use:cell.events>
						<ExtraProps extraProps={cell.extraProps()} let:extraProps>
							<Render {...cell.render()} />
							{#if extraProps.order === 'asc'}
								⬇️
							{:else if extraProps.order === 'desc'}
								⬆️
							{/if}
						</ExtraProps>
					</th>
				{/each}
			</tr>
		{/each}
	</thead>
	<tbody>
		{#each $bodyRows as bodyRow}
			<tr>
				{#each bodyRow.cells as cell}
					<td>
						<Render {...cell.render()} />
					</td>
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
			columnOrder: $columnOrder,
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
