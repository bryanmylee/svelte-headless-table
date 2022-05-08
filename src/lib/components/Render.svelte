<script lang="ts">
	import { Subscribe } from 'svelte-subscribe';
	import type { RenderConfig } from '$lib/render';
	import { isReadable, Undefined } from '$lib/utils/store';

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
{:else if isReadable(rendered.props)}
	<Subscribe props={rendered.props} let:props>
		<svelte:component this={rendered.component} {...props ?? {}} />
	</Subscribe>
{:else}
	<svelte:component this={rendered.component} {...rendered.props ?? {}} />
{/if}
