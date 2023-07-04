<script lang="ts">
  export let name: string;
  export let age: number;
  export let progress: number;
</script>

<div>{name}, <strong>{age}</strong></div>
<div>{progress} / 100</div>

<style>
  div {
    font-size: 0.875rem;
  }
</style>
