<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';

	export let isSelected: Writable<boolean>;
	export let isAllSubRowsSelected: Readable<boolean>;
</script>

<input type="checkbox" bind:checked={$isSelected} />
