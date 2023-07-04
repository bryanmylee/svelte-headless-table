<script lang="ts" context="module">
  export const getDistinct = (items: unknown[]): unknown[] => {
    return Array.from(new Set(items));
  };
</script>

<script lang="ts">
  import type { Readable, Writable } from 'svelte/store';

  export let filterValue: Writable<string | undefined>;
  export let preFilteredValues: Readable<unknown[]>;
  $: uniqueValues = getDistinct($preFilteredValues);
</script>

<select bind:value={$filterValue} on:click|stopPropagation class="demo">
  <option value={undefined}>All</option>
  {#each uniqueValues as value}
    <option {value}>{value}</option>
  {/each}
</select>
