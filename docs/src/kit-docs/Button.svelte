<script lang="ts">
  type ButtonVariant = 'filled' | 'unfilled';
  type ButtonSize = 'lg' | 'md';

  type $$Props = {
    variant?: ButtonVariant;
    size?: ButtonSize;
  } & (
    | ({ href?: never } & Partial<HTMLButtonElement>)
    | ({ href: string } & Partial<HTMLAnchorElement>)
  );

  export let variant: ButtonVariant = 'filled';
  export let size: ButtonSize = 'md';
</script>

<svelte:element
  this={$$restProps.href === undefined ? 'button' : 'a'}
  {...$$restProps}
  class="button {variant} {size}"
  on:click
>
  <slot />
</svelte:element>

<style lang="postcss">
  .button {
    @apply rounded-xl shadow;
    @apply transition-colors;
    /* reset anchor tag */
    @apply no-underline border-b-0 font-normal cursor-pointer;
    &.lg {
      @apply px-6 py-3;
    }
    &.md {
      @apply px-4 py-1;
    }
    &.filled {
      @apply bg-primary text-white font-bold;
      &:hover {
        @apply bg-primary-light;
      }
      &:active {
        @apply bg-primary-dark;
      }
    }
    &.unfilled {
      @apply text-secondary font-bold;
      &:hover {
        @apply text-secondary-light;
      }
      &:active {
        @apply text-secondary-dark;
      }
      :global(.dark) & {
        @apply text-white;
      }
    }
  }
</style>
