<script lang="ts">
	import type { Readable } from 'svelte/store';

	type ExtraProps = $$Generic;

	export let extraProps: Readable<ExtraProps>;
</script>

<slot extraProps={$extraProps} />
