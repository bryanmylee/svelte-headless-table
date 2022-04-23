<script lang="ts">
	import { useTable, Render, createColumns, createDataColumn, createGroup } from '$lib';
	import Italic from './_Italic.svelte';
	import { sampleRows, type SampleRow } from '$lib/sampleRows';
	import { mean, sum } from '$lib/utils/math';

	let columns = createColumns<SampleRow>([
		createGroup({
			header: 'Name',
			columns: [
				createDataColumn({
					header: 'First Name',
					key: 'firstName',
				}),
				createDataColumn({
					header: 'Last Name',
					key: 'lastName',
				}),
			],
		}),
		createGroup({
			header: 'Info',
			footer: 'Summary',
			columns: [
				createDataColumn({
					header: 'Age',
					footer: ({ data }) => `Average: ${mean(...data.map((d) => d.age))}`,
					key: 'age',
				}),
				createDataColumn({
					header: 'Visits',
					footer: ({ data }) => `Total: ${sum(...data.map((d) => d.visits))}`,
					key: 'visits',
				}),
				createDataColumn({
					header: {
						component: Italic,
						props: {
							text: 'Status',
						},
					},
					cell: ({ value }) => ({
						component: Italic,
						props: {
							text: value,
						},
					}),
					key: 'status',
				}),
				createDataColumn({
					header: 'Profile Progress',
					footer: ({ data }) => `Average: ${mean(...data.map((d) => d.progress))}`,
					key: 'progress',
				}),
			],
		}),
	]);

	const table = useTable({ data: sampleRows, columns });
</script>

<h1>svelte-tables</h1>

<table>
	<thead>
		{#each $table.headerRows as headerRow}
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
		{#each $table.dataRows as dataRow}
			<tr>
				{#each dataRow.cells as cell}
					<td>
						<Render {...cell.render()} />
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
	<tfoot>
		{#each $table.footerRows as footerRow}
			<tr>
				{#each footerRow.cells as cell}
					<td {...cell.attrs()}>
						<Render {...cell.render()} />
					</td>
				{/each}
			</tr>
		{/each}
	</tfoot>
</table>

<style global>
	* {
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
