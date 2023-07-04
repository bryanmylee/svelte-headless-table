<script lang="ts" context="module">
  export const isNumber = (value: unknown): value is number => typeof value === 'number';
</script>

<script lang="ts">
  import type { Readable, Writable } from 'svelte/store';

  export let filterValue: Writable<number | undefined>;

  export let preFilteredValues: Readable<unknown[]>;
  $: min = $preFilteredValues.length === 0 ? 0 : Math.min(...$preFilteredValues.filter(isNumber));
  $: max = $preFilteredValues.length === 0 ? 0 : Math.max(...$preFilteredValues.filter(isNumber));
</script>

<input type="range" {min} {max} bind:value={$filterValue} on:click|stopPropagation />
