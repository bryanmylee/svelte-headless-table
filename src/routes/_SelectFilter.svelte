<script lang="ts">
	import { getDistinct, getDuplicates } from '$lib/utils/array';

	import type { Readable, Writable } from 'svelte/store';

	export let filterValue: Writable<string>;
	export let values: Readable<unknown[]>;
	$: uniqueValues = getDistinct($values);
</script>

<select bind:value={$filterValue} on:click|stopPropagation>
	<option value={undefined}>All</option>
	{#each uniqueValues as value}
		<option {value}>{value}</option>
	{/each}
</select>
