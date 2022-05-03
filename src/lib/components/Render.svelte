<script lang="ts">
	import type { RenderConfig } from '$lib/render';

	type Component = {
		render(): RenderConfig;
	};

	export let of: Component;
	const render = of.render();
</script>

{#if typeof render === 'string'}
	{render}
{:else}
	<svelte:component this={render.component} {...render.props} />
{/if}
