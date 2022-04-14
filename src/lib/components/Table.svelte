<script lang="ts">
	import type { Column } from '$lib/models/Column';
	import { getDataColumns } from '$lib/utils/getDataColumns';
	import { getDataRows } from '$lib/utils/getDataRows';
	import { getFooterRows } from '$lib/utils/getFooterRows';
	import { getHeaderRows } from '$lib/utils/getHeaderRows';

	type Item = $$Generic<object>;

	export let columns: Column<Item>[];
	const dataColumns = getDataColumns(columns);
	const headerRows = getHeaderRows(columns);
	const footerRows = getFooterRows(columns);

	export let data: Item[];
	const dataRows = getDataRows(data, dataColumns);
</script>

<slot {data} {dataColumns} {headerRows} {footerRows} {dataRows} />
