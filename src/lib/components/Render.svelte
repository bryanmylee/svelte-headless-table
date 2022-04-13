<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	export let text: Maybe<string> = undefined;
	export let component: Maybe<typeof SvelteComponent> = undefined;
	export let props: Maybe<Record<string, unknown>> = undefined;
</script>

{#if text !== undefined}
	{text}
{:else if component !== undefined}
	<svelte:component this={component} {...props} />
{/if}
