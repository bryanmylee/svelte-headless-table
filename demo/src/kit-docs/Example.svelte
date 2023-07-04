<script lang="ts">
  import { fly, slide } from 'svelte/transition';
  import { Disclosure, DisclosureButton, DisclosurePanel } from '@rgossiaux/svelte-headlessui';
</script>

<div class="disclosure">
  <Disclosure class="root" let:open>
    <DisclosureButton class="trigger">
      &nbsp;
      {#if open}
        <span transition:fly|local={{ y: 20 }}>Hide example</span>
      {:else}
        <span transition:fly|local={{ y: -20 }}>Show example</span>
      {/if}
    </DisclosureButton>
    {#if open}
      <div transition:slide|local class="slide">
        <DisclosurePanel static class="panel">
          <slot />
        </DisclosurePanel>
      </div>
    {/if}
  </Disclosure>
</div>

<style lang="postcss">
  .disclosure {
    & :global(.root) {
      @apply px-4 py-2 border rounded-lg;
      @apply border-gray-200 bg-gray-100/50;
      :global(.dark) & {
        @apply border-gray-600 bg-gray-800/50;
      }
    }

    & :global(.trigger) {
      @apply relative w-full text-left text-sm;
    }
    & :global(.trigger span) {
      @apply absolute left-0;
    }

    & .slide {
      @apply py-2;
    }

    & :global(.panel) {
      @apply py-2 border-t border-gray-200;
      :global(.dark) & {
        @apply border-gray-600;
      }
    }
    & :global(.panel > *:first-child) {
      @apply !mt-0;
    }
    & :global(.panel > *:last-child) {
      @apply !mb-0;
    }
  }
</style>
