<script lang="ts">
	import type { Readable } from 'svelte/store';

	export let extraProps: Readable<Record<string, unknown>>;
</script>

<slot extraProps={$extraProps} />
