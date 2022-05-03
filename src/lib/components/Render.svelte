<script lang="ts" context="module">
	const Undefined = readable(undefined);
</script>

<script lang="ts">
	import { readable } from 'svelte/store';
	import type { RenderConfig } from '$lib/render';
	import { isReadable } from '$lib/utils/store';

	let rendered: RenderConfig;
	export { rendered as of };

	const readableRendered = isReadable(rendered) ? rendered : Undefined;
</script>

{#if isReadable(rendered)}
	<!-- Auto-subscriptions must be on a `Readable`.
		$reactiveRendered is guaranteed to be `Readable` -->
	{$readableRendered}
{:else if typeof rendered === 'string'}
	{rendered}
{:else}
	<svelte:component this={rendered.component} {...rendered.props ?? {}} />
{/if}
