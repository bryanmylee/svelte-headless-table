<script lang="ts">
	import type { Column } from '$lib/types/Column';
	import { getDataRows } from '$lib/utils/getDataRows';
	import { getHeaderRows } from '$lib/utils/getHeaderRows';
	import { getLeafColumns } from '$lib/utils/getLeafColumns';

	type Item = $$Generic<object>;

	export let columns: Column<Item>[];
	$: leafColumns = getLeafColumns(columns);
	$: keys = leafColumns.map((column) => column.key);
	$: headerRows = getHeaderRows(columns);

	export let data: Item[];
	$: dataRows = getDataRows(data, keys);

	let className: Maybe<string> = undefined;
	export { className as class };
	export let style: Maybe<string> = undefined;
</script>

<table class={className} {style}>
	<slot {leafColumns} {headerRows} {dataRows} />
</table>
