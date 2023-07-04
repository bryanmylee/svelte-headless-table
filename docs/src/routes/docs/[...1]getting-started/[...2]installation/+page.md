---
title: Installation
description: How to install Svelte Headless Table
---

# {$frontmatter?.title}

Install Svelte Headless Table with the package manager of your choice.

<script>
  let activeTab = 'npm';
  const tabs = ['npm', 'Yarn', 'pnpm'];
</script>

<div class="flex gap-2">
  {#each tabs as tab}
    <Button
      variant={activeTab === tab ? 'filled' : 'unfilled'}
      on:click={() => activeTab = tab}
    >{tab}</Button>
  {/each}
</div>

{#if activeTab === 'npm'}

```bash copy
npm install -D svelte-headless-table
```

{:else if activeTab === 'Yarn'}

```bash copy
yarn add -D svelte-headless-table
```

{:else}

```bash copy
pnpm install -D svelte-headless-table
```

{/if}

Svelte Headless Table requires Svelte `3.48.0` or later.
