---
title: addGridLayout
description: Use CSS Grid to layout the table
sidebar_title: addGridLayout
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`addGridLayout` configures the table to use [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) for laying out the table.

## Examples

### CSS Grid layout

:::example

[REPL](https://svelte.dev/repl/1cbeae0c59f0468d9d18b0b7d65e4b0e?version=3.50.1)

<script>
  import SimpleGridLayoutDemo from './SimpleGridLayoutDemo.svelte'
</script>
<SimpleGridLayoutDemo />

:::
