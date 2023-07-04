<div>
  <slot />
</div>

<style lang="postcss">
  div {
    @apply px-4 border-2 rounded-lg text-sm;
    @apply border-gray-200 bg-gray-100/50;
    :global(.dark) & {
      @apply border-gray-600 bg-gray-600/50;
    }
  }
</style>
