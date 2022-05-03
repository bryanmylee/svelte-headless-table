<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let filterValue: Writable<string>;
</script>

<input type="text" bind:value={$filterValue} />
