<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';

	export let isExpanded: Writable<boolean>;
	export let canExpand: Readable<boolean>;
</script>

{#if $canExpand}
	<span on:click={() => ($isExpanded = !$isExpanded)}>
		{#if $isExpanded}
			👇
		{:else}
			👉
		{/if}
	</span>
{/if}
