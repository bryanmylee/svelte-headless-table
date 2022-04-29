<script lang="ts">
	import { writable } from 'svelte/store';
	import { column, createColumns, group } from '$lib/columns';
	import { useTable } from '$lib/useTable';
	import { sampleRows, type SampleRow } from './_sampleRows';
	import Render from '$lib/components/Render.svelte';
	import { getShuffled } from '$lib/utils/array';
	import { sortBy } from '$lib/plugins/sortBy';

	const data = writable(sampleRows);
	const columnOrder = writable<Array<string>>([
		'status',
		'firstName',
		'lastName',
		'age',
		'visits',
		'progress',
	]);
	const hiddenColumns = writable<Array<string>>(['progress']);

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

	const { headerRows, bodyRows, plugins } = useTable(
		{
			data,
			columns,
		},
		{
			sort: sortBy(),
		}
	);
	const { sortKeys } = plugins.sort;
</script>

<h1>svelte-tables</h1>

<pre>{JSON.stringify(
		{
			columnOrder: $columnOrder,
			hiddenColumns: $hiddenColumns,
			sortKeys: $sortKeys,
		},
		null,
		2
	)}</pre>

<button on:click={() => ($columnOrder = getShuffled($columnOrder))}>Shuffle columns</button>

<table>
	<thead>
		{#each $headerRows as headerRow (headerRow.id)}
			<tr>
				{#each headerRow.cells as cell (cell.id)}
					<th {...cell.attrs()} use:cell.events>
						<Render {...cell.render()} />
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
