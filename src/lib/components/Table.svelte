<script lang="ts">
	import type { Column } from '$lib/models/Column';
	import { TableInstance } from '$lib/models/TableInstance';

	type Item = $$Generic<object>;

	export let data: Item[];
	export let columns: Column<Item>[];
	const tableInstance = new TableInstance({ data, columns });
</script>

<slot {...tableInstance} />
