<script lang="ts">
	import type { Readable } from 'svelte/store';

	type Props = $$Generic;

	export let props: Readable<Props>;
</script>

<slot props={$props} />
