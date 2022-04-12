<script lang="ts">
	import type { Column } from '$lib/types/Column';
	import type { DataTransformer } from '$lib/types/DataTransformer';
	import { applyTransforms } from '$lib/utils/applyTransforms';
	import { getDataRows } from '$lib/utils/getDataRows';
	import { getHeaderRows } from '$lib/utils/getHeaderRows';
	import { getLeafColumns } from '$lib/utils/getLeafColumns';

	type Item = $$Generic<object>;

	export let data: Item[];
	export let columns: Column<Item>[];
	$: leafColumns = getLeafColumns(columns);
	$: keys = leafColumns.map((column) => column.key);
	$: headerRows = getHeaderRows(columns);

	export let transforms: DataTransformer<Item>[] = [];

	$: transformedData = applyTransforms(data, transforms);
	$: dataRows = getDataRows(transformedData, keys);

	let className: Maybe<string> = undefined;
	export { className as class };
	export let style: Maybe<string> = undefined;
</script>

<table class={className} {style}>
	<slot {leafColumns} {headerRows} {dataRows} />
</table>
