---
title: TableState
description: The current state of the table
sidebar_title: TableState
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`TableState` is the [`TableViewModel`](../table-view-model.md) with two additional properties.

## Usage

### `data: ReadOrWritable<Item[]>`

A reference to the original data source.

### `columns: Column[]`

A reference to the columns of the table.
