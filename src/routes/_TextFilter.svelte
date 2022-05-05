<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';

	export let filterValue: Writable<string>;
	export let filteredValues: Readable<string[]>;
</script>

<input
	type="text"
	bind:value={$filterValue}
	on:click|stopPropagation
	placeholder="Search {$filteredValues.length} records..."
/>
