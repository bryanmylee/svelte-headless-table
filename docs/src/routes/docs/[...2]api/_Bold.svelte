<script lang="ts">
  export let text: string;
</script>

<span>{text}</span>

<style lang="postcss">
  span {
    @apply font-bold;
  }
</style>
