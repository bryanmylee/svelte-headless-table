<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { sampleRows, type SampleRow } from '$lib/sampleRows';
	import type { ColumnDef } from '$lib/types/ColumnDef';

	const columns: ColumnDef<SampleRow>[] = [
		{
			header: 'Name',
			columns: [
				{
					header: 'First Name',
					key: 'firstName',
				},
				{
					header: 'Last Name',
					key: 'lastName',
				},
			],
		},
		{
			header: 'Info',
			columns: [
				{
					header: 'Age',
					key: 'age',
				},
				{
					header: 'Visits',
					key: 'visits',
				},
				{
					header: 'Status',
					key: 'status',
				},
				{
					header: 'Profile Progress',
					key: 'progress',
				},
			],
		},
	];
</script>

<h1>svelte-tables</h1>

<Table data={sampleRows} {columns} let:headerRows let:dataRows>
	<thead>
		{#each headerRows as headerRow}
			<tr>
				{#each headerRow as { colspan, header }}
					<th {colspan}>{header}</th>
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
