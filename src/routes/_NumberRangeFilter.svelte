<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let filterValue: Writable<[number | null, number | null]>;
</script>

<div>
	<input type="number" bind:value={$filterValue[0]} on:click|stopPropagation placeholder="min" />
	to
	<input type="number" bind:value={$filterValue[1]} on:click|stopPropagation placeholder="max" />
</div>

<style>
	div {
		display: flex;
	}
</style>
