<script lang="ts">
	import type { RenderProps } from '$lib/types/RenderProps';

	type Component = {
		render(): RenderProps;
	};

	export let of: Component;
	const { component, props, text } = of.render();
</script>

{#if text !== undefined}
	{text}
{:else if component !== undefined}
	<svelte:component this={component} {...props} />
{/if}
