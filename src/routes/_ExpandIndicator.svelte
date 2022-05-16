<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';

	export let isExpanded: Writable<boolean>;
	export let canExpand: Readable<boolean>;
	export let isAllSubRowsExpanded: Readable<boolean>;
	export let depth: number;
</script>

{#if $canExpand}
	<span on:click={() => ($isExpanded = !$isExpanded)} style:--depth={depth}>
		{#if $isExpanded}
			{#if $isAllSubRowsExpanded}
				⬇️
			{:else}
				↘️
			{/if}
		{:else}
			➡️
		{/if}
	</span>
{/if}

<style>
	span {
		padding-left: calc(var(--depth) * 1rem);
	}
</style>
