<script lang="ts">
  import type { Readable, Writable } from 'svelte/store';

  export let isSelected: Writable<boolean>;
  export let isSomeSubRowsSelected: Readable<boolean>;
</script>

<input type="checkbox" bind:checked={$isSelected} indeterminate={$isSomeSubRowsSelected} />
