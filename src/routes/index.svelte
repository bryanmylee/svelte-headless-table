<script lang="ts">
	import { writable } from 'svelte/store';
	import { column, createColumns, group } from '$lib/columns';
	import { useTable } from '$lib/useTable';
	import type { SampleRow } from './_sampleRows';
	import Render from '$lib/components/Render.svelte';

	const columnOrder = writable<Array<string>>([]);
	const hiddenColumns = writable<Array<string>>([]);

	const { headerRows } = useTable<SampleRow>({
		columns: createColumns([
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
		]),
		columnOrder,
		hiddenColumns,
	});
	$: console.log($headerRows);
</script>

<h1>svelte-tables</h1>

<pre>{JSON.stringify(
		{
			columnOrder: $columnOrder,
			hiddenColumns: $hiddenColumns,
		},
		null,
		2
	)}</pre>

<table>
	<thead>
		{#each $headerRows as headerRow}
			<tr>
				{#each headerRow.cells as cell}
					<th {...cell.attrs()}>
						<Render {...cell.render()} />
					</th>
				{/each}
			</tr>
		{/each}
	</thead>
	<tbody>
		<!-- {#each $table.dataRows as dataRow} -->
		<tr>
			<!-- {#each dataRow.cells as cell} -->
			<td>
				<!-- <Render {...cell.render()} /> -->
			</td>
			<!-- {/each} -->
		</tr>
		<!-- {/each} -->
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
