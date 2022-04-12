<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { sampleRows, type RowData } from '$lib/sampleRows';
	import type { Column } from '$lib/types/Column';

	const columns: Column<RowData>[] = [
		{
			name: 'Name',
			columns: [
				{
					name: 'First Name',
					key: 'firstName',
				},
				{
					name: 'Last Name',
					key: 'lastName',
				},
			],
		},
		{
			name: 'Info',
			columns: [
				{
					name: 'Age',
					key: 'age',
				},
				{
					name: 'Visits',
					key: 'visits',
				},
				{
					name: 'Status',
					key: 'status',
				},
				{
					name: 'Profile Progress',
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
				{#each headerRow as { colspan, name }}
					<th {colspan}>{name}</th>
				{/each}
			</tr>
		{/each}
	</thead>
</Table>
