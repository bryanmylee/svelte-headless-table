---
title: Table
description: The main Table instance to control the table
sidebar_title: Table
---

<script>
  import { Render, createRender } from 'svelte-headless-table';
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`Table` is the main instance returned by [`createTable`](../create-table.md).

## Usage

### [`createColumns: (columns) => Column[]`](../create-columns.md)

### [`createViewModel: (columns) => TableViewModel`](../create-view-model.md)
