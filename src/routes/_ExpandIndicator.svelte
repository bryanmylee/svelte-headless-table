<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';

	export let isExpanded: Writable<boolean>;
	export let canExpand: Readable<boolean>;
	export let isAllSubRowsExpanded: Readable<boolean>;
</script>

{#if $canExpand}
	<span on:click={() => ($isExpanded = !$isExpanded)}>
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
