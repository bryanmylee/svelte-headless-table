<script lang="ts">
	import Render from '$lib/components/Render.svelte';
	import Table from '$lib/components/Table.svelte';
	import { sampleRows, type SampleRow } from '$lib/sampleRows';
	import { createColumns, createDataColumn, createGroup } from '$lib/utils/createColumns';
	import { getHeaderProps } from '$lib/utils/getHeaderProps';
	import { renderHeader } from '$lib/utils/renderHeader';

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
			columns: [
				createDataColumn({
					header: 'Age',
					key: 'age',
				}),
				createDataColumn({
					header: (rows) => `Visits: ${rows.length}`,
					key: 'visits',
				}),
				createDataColumn({
					header: 'Status',
					key: 'status',
				}),
				createDataColumn({
					header: 'Profile Progress',
					key: 'progress',
				}),
			],
		}),
	]);
</script>

<h1>svelte-tables</h1>

<Table data={sampleRows} {columns} let:headerRows let:dataRows>
	<thead>
		{#each headerRows as headerRow}
			<tr>
				{#each headerRow as cell}
					<th {...getHeaderProps(cell)}>
						<Render {...renderHeader(cell, { dataRows })} />
					</th>
				{/each}
			</tr>
		{/each}
	</thead>
	<tbody>
		{#each dataRows as dataRow}
			<tr>
				{#each dataRow as { value }}
					<td>{value}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
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
