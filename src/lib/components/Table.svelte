<script lang="ts">
	import type { Column } from '$lib/types/Column';
	import { getDataColumns } from '$lib/utils/getDataColumns';
	import { getDataRows } from '$lib/utils/getDataRows';
	import { getFooterRows } from '$lib/utils/getFooterRows';
	import { getHeaderRows } from '$lib/utils/getHeaderRows';

	type Item = $$Generic<object>;

	export let columns: Column<Item>[];
	$: dataColumns = getDataColumns(columns);
	$: headerRows = getHeaderRows(columns);
	$: footerRows = getFooterRows(columns);

	export let data: Item[];
	$: dataRows = getDataRows(data, dataColumns);

	let className: Maybe<string> = undefined;
	export { className as class };
	export let style: Maybe<string> = undefined;
</script>

<table class={className} {style}>
	<slot {data} {dataColumns} {headerRows} {footerRows} {dataRows} />
</table>
