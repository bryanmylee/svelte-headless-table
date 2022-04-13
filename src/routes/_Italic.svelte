<script lang="ts">
	import { onMount } from 'svelte';

	export let text: string;
	onMount(() => {
		console.log('mount Italic');
		return () => {
			console.log('unmount Italic');
		};
	});
</script>

<em>{text}</em>
