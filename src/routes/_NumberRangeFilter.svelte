<script lang="ts">
	import { isNumber } from '$lib/utils/filter';
	import type { Readable, Writable } from 'svelte/store';

	export let filterValue: Writable<[number | null, number | null]>;

	export let id: string | undefined = undefined;
	export let filteredValues: Readable<unknown[]>;
	$: min = Math.min(...$filteredValues.filter(isNumber));
	$: max = Math.max(...$filteredValues.filter(isNumber));
</script>

<div>
	<input
		type="number"
		bind:value={$filterValue[0]}
		on:click|stopPropagation
		placeholder="Min ({min})"
	/>
	to
	<input
		type="number"
		bind:value={$filterValue[1]}
		on:click|stopPropagation
		placeholder="Max ({max})"
	/>
</div>

<style>
	div {
		display: flex;
		gap: 0.5rem;
	}
</style>
