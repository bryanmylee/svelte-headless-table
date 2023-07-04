<script lang="ts">
  import type { Readable, Writable } from 'svelte/store';
  import { isNumber } from '$lib/utils/filter';

  export let filterValue: Writable<[number | null, number | null]>;

  export let values: Readable<unknown[]>;
  $: min = $values.length === 0 ? 0 : Math.min(...$values.filter(isNumber));
  $: max = $values.length === 0 ? 0 : Math.max(...$values.filter(isNumber));
</script>

<div class="flex items-center">
  <input
    type="number"
    bind:value={$filterValue[0]}
    on:click|stopPropagation
    placeholder="Min ({min})"
    class="demo"
  />
  to
  <input
    type="number"
    bind:value={$filterValue[1]}
    on:click|stopPropagation
    placeholder="Max ({max})"
    class="demo"
  />
</div>

<style>
  div {
    display: flex;
    gap: 0.5rem;
  }
</style>
