<script lang="ts">
	import { getDistinct } from '$lib/utils/array';

	import type { Readable, Writable } from 'svelte/store';

	export let filterValue: Writable<string>;
	export let preFilteredValues: Readable<unknown[]>;
	$: uniqueValues = getDistinct($preFilteredValues);
</script>

<select bind:value={$filterValue} on:click|stopPropagation>
	<option value={undefined}>All</option>
	{#each uniqueValues as value}
		<option {value}>{value}</option>
	{/each}
</select>
