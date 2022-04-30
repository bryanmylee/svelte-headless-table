<script lang="ts">
	import type { Readable } from 'svelte/store';

	type Attrs = $$Generic;
	type Props = $$Generic;

	type Component = {
		attrs(): Readable<Attrs>;
		props(): Readable<Props>;
	};
	export let to: Component;
	const attrs = to.attrs();
	const props = to.props();
</script>

<slot attrs={$attrs} props={$props} />
