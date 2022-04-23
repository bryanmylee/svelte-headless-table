<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let text: string | undefined = undefined;
	export let component: typeof SvelteComponent | undefined = undefined;
	export let props: Record<string, unknown> | undefined = undefined;
</script>

{#if text !== undefined}
	{text}
{:else if component !== undefined}
	<svelte:component this={component} {...props} />
{/if}
