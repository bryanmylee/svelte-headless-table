---
title: HeaderRow
description: The model for a header row
sidebar_title: HeaderRow
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter.title}

`HeaderRow` represents the model of a `<tr>` element in `<thead>`.

## Usage

### `id: string`

A constant `id` that uniquely identifies the header row.

### `attrs: () => Readable<HeaderRowAttributes>`

A `Readable` store with attributes to apply onto the `<tr>` element.

### `props: () => Readable<HeaderRowProps>`

A `Readable` store with additional properties derived from plugin view model extensions.

:::admonition type="tip"
See also [Plugin View Model Extensions](../plugins/overview#connecting-plugins-to-markup).
:::

### `cells: HeaderCell[]`

An array of [`HeaderCell`](../header-cell.md)s to iterate over and apply onto `<th>` elements.

`cells` only includes the cells of **visible columns**.
