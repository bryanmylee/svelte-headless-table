<script lang="ts">
	import Render from '$lib/components/Render.svelte';
	import Table from '$lib/components/Table.svelte';
	import Italic from './_Italic.svelte';
	import { sampleRows, type SampleRow } from '$lib/sampleRows';
	import { createColumns, createDataColumn, createGroup } from '$lib/utils/createColumns';
	import { getFooterProps } from '$lib/utils/getFooterProps';
	import { getHeaderProps } from '$lib/utils/getHeaderProps';
	import { mean, sum } from '$lib/utils/math';
	import { renderFooter } from '$lib/utils/renderFooter';
	import { renderHeader } from '$lib/utils/renderHeader';
	import { renderData } from '$lib/utils/renderData';

	const columns = createColumns<SampleRow>([
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
					footer: ({ data }) => `Average: ${mean(...data.map((d) => d['age']))}`,
					key: 'age',
				}),
				createDataColumn({
					header: 'Visits',
					footer: ({ data }) => `Total: ${sum(...data.map((d) => d['visits']))}`,
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
					footer: ({ data }) => `Average: ${mean(...data.map((d) => d['progress']))}`,
					key: 'progress',
				}),
			],
		}),
	]);
</script>

<h1>svelte-tables</h1>

<Table data={sampleRows} {columns} let:data let:headerRows let:dataRows let:footerRows>
	<table>
		<thead>
			{#each headerRows as headerRow}
				<tr>
					{#each headerRow as cell}
						<th {...getHeaderProps(cell)}>
							<Render {...renderHeader(cell, { data })} />
						</th>
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody>
			{#each dataRows as dataRow}
				<tr>
					{#each dataRow.cells as cell}
						<td>
							<Render {...renderData(cell)} />
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			{#each footerRows as footerRow}
				<tr>
					{#each footerRow as cell}
						<td {...getFooterProps(cell)}>
							<Render {...renderFooter(cell, { data })} />
						</td>
					{/each}
				</tr>
			{/each}
		</tfoot>
	</table>
</Table>

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
