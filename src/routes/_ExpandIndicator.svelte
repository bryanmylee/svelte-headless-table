<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let isExpanded: Writable<boolean>;
</script>

<span on:click={() => ($isExpanded = !$isExpanded)}>
	{#if $isExpanded}
		👇
	{:else}
		👉
	{/if}
</span>
