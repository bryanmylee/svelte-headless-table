<script lang="ts">
  export let label: string;
  export let order: string | undefined;
  $: indicator = order === 'asc' ? '🔼' : order === 'desc' ? '🔽' : '';
  export let toggle: (ev: Event) => void;
</script>

<div on:click={toggle}>{label} {indicator}</div>