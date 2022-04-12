<script lang="ts">
	import type { Column } from '$lib/types/Column';
	import { getHeaderRows } from '$lib/utils/getHeaderRows';

	type Item = $$Generic<object>;

	export let data: Item[];
	export let columns: Column<Item>[];
	$: headerRows = getHeaderRows(columns);
</script>

<table>
	<slot rows={data} {headerRows} />
</table>
