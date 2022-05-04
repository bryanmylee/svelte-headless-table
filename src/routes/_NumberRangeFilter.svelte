<script lang="ts">
	import type { BodyRow } from '$lib/bodyRows';
	import { isNumber } from '$lib/utils/filter';
	import { UndefinedAs } from '$lib/utils/store';
	import type { Readable, Writable } from 'svelte/store';

	export let filterValue: Writable<[number | null, number | null]>;

	export let id: string | undefined = undefined;
	export let filteredRows: Readable<BodyRow<unknown>[]> = UndefinedAs<BodyRow<unknown>[]>();
	let values: unknown[];
	$: if (id !== undefined && $filteredRows !== undefined) {
		values = $filteredRows.map((row) => row.cellForId[id!].value);
	}
	$: min = Math.min(...values.filter(isNumber));
	$: max = Math.max(...values.filter(isNumber));
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
