<script lang="ts">
	import type { RenderConfig } from '$lib/render';

	let rendered: RenderConfig;
	export { rendered as of };
</script>

{#if typeof rendered === 'string'}
	{rendered}
{:else}
	<svelte:component this={rendered.component} {...rendered.props ?? {}} />
{/if}
