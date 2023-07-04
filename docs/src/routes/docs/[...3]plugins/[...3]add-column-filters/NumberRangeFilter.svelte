<script lang="ts" context="module">
  export const isNumber = (value: unknown): value is number => typeof value === 'number';
</script>

<script lang="ts">
  import type { Readable, Writable } from 'svelte/store';

  export let filterValue: Writable<[number | null, number | null]>;

  export let values: Readable<unknown[]>;
  $: min = $values.length === 0 ? 0 : Math.min(...$values.filter(isNumber));
  $: max = $values.length === 0 ? 0 : Math.max(...$values.filter(isNumber));
</script>

<div>
  <input
    type="number"
    bind:value={$filterValue[0]}
    on:click|stopPropagation
    class="demo"
    placeholder="Min ({min})"
  />
  to
  <input
    type="number"
    bind:value={$filterValue[1]}
    on:click|stopPropagation
    class="demo"
    placeholder="Max ({max})"
  />
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
  }
  input {
    width: 5rem;
  }
</style>
