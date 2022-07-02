---
title: Unopinionated and extensible data tables for Svelte
description: Build and design powerful datagrid experiences while retaining 100% control over styles and markup.
---

<div class="max-w-5xl p-4 mx-auto">

# {$frontmatter.title}

{$frontmatter.description}

Svelte Headless Table is designed to work **seamlessly** with Svelte. If you love Svelte, you will love Svelte Headless Table.

<div class="flex justify-center gap-4">
  <Button size="lg" href="/docs">Get started</Button>
  <Button size="lg" variant="unfilled" href="https://github.com/bryanmylee/svelte-headless-table">
    GitHub
  </Button>
</div>

## Headless

Beauty is subjective – everybody wants components to match their own theme! That's why Svelte Headless Table is **headless** by design. You are in full control of how your table looks, down to the very last component, class, and style.

## Declarative

Just describe how you want your tables to behave and let Svelte Headless Table handle the rest! It is designed with full TypeScript support and an intuitive API that lets you get started immediately.

## Extensible

Svelte Headless Table comes with a stable plugin system that allows you to transform and modify every step under the hood. If you want extra functionality, you can build it!

</div>

<div class="max-w-5xl p-4 mx-auto mt-10">

# Features

Svelte Headless Table comes with everything you will need...

<script>
  import CheckIcon from '~icons/ic/round-check-circle-outline'
</script>

<ul class="grid text-sm md:text-base grid-cols-2 gap-2 p-0 lg:grid-cols-3">
  {#each [
    'Full TypeScript support', 'SvelteKit integration', 'SSR support',
    'State management via stores', 'Highly performant', 'Fully customizable',
  ] as feature}
    <li class="flex gap-2 items-center m-0 list-none">
      <CheckIcon class="text-green-400 wh-7 min-wh-7"/> {feature}
    </li>
  {/each}
</ul>

As well as an extensive feature set!

<ul class="grid text-sm md:text-base grid-cols-2 gap-2 p-0 lg:grid-cols-3">
  {#each [
    'Multi-sorting', 'Filtering by column values', 'Global filtering',
    'Column reordering', 'Hiding columns', 'Pagination',
    'Row grouping and aggregation', 'Row expansion',
    'Row selection', 'Column resizing', 'Alternate layouts'
  ] as feature}
    <li class="flex gap-2 items-center m-0 list-none">
      <CheckIcon class="text-green-400 wh-7 min-wh-7"/> {feature}
    </li>
  {/each}
</ul>

Want to learn more? Visit the [Plugin System](./docs/plugins/overview.md) to find out more.

</div>

<div class="mt-40" />
