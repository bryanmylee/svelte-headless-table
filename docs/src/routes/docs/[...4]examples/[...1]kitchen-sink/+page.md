---
title: Kitchen Sink
description: An example with all plugins enabled.
---

# {$frontmatter?.title}

A table with all plugins enabled, including:

1. multi-sorting
2. column and table filtering
3. column re-ordering and hiding
4. pagination
5. row grouping and aggregation
6. row expansion
7. row selection
8. column resizing

:::admonition type="info"
Source code available on the [REPL](https://svelte.dev/repl/457c10b649cc4bc7a84f9511a81b5361?version=3.48.0).
:::

<script>
  import KitchenSink from './KitchenSink.svelte';
</script>

<KitchenSink />
