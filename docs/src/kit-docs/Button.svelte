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
    @apply rounded-lg shadow;
    @apply transition-colors;
    /* reset anchor tag */
    @apply no-underline border-b-0 font-normal cursor-pointer;
    &.lg {
      @apply px-8 py-4;
    }
    &.md {
      @apply px-4 py-2;
    }
    &.filled {
      @apply bg-primary text-white;
      &:hover {
        @apply bg-primary-light;
      }
      &:active {
        @apply bg-primary-dark;
      }
    }
    &.unfilled {
      @apply text-primary;
      &:hover {
        @apply text-primary-light;
      }
      &:active {
        @apply text-primary-dark;
      }
    }
  }
</style>
