<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { sampleRows, type RowData } from '$lib/sampleRows';
	import type { Column } from '$lib/types/Column';

	const columns: Column<RowData>[] = [
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

<Table data={sampleRows} {columns} let:headerRows>
	<thead>
		{#each headerRows as headerRow}
			<tr>
				{#each headerRow as { colspan, header }}
					<th {colspan}>{header}</th>
				{/each}
			</tr>
		{/each}
	</thead>
</Table>
