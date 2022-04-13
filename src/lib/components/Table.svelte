<script lang="ts">
	import { writable } from 'svelte/store';
	import type { Column } from '$lib/models/Column';
	import { getDataColumns } from '$lib/utils/getDataColumns';
	import { getDataRows } from '$lib/utils/getDataRows';
	import { getFooterRows } from '$lib/utils/getFooterRows';
	import { getHeaderRows } from '$lib/utils/getHeaderRows';

	type Item = $$Generic<object>;

	export { _columns as columns };
	let _columns: Column<Item>[];
	const columns = writable(_columns);
	$: $columns = _columns;

	$: dataColumns = getDataColumns(_columns);
	$: headerRows = getHeaderRows(_columns);
	$: footerRows = getFooterRows(_columns);

	export { _data as data };
	let _data: Item[];
	const data = writable(_data);
	$: $data = _data;

	$: dataRows = getDataRows(_data, dataColumns);
</script>

<slot data={$data} {dataColumns} {headerRows} {footerRows} {dataRows} />
