<script lang="ts">
	import type { Column } from '$lib/types/Column';

	type Item = $$Generic<object>;

	export let data: Item[];
	export let columns: Column<Item>[];
</script>

<table>
	<slot rows={data} />
</table>
