---
title: createTable
description: Define your data source and the plugins to use
sidebar_title: createTable
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter.title}

Every Svelte Headless Table starts with `createTable`. It takes a data source and plugin configuration, and returns a [`Table`](../--table.md) instance.

## Usage

---

### `createTable: (data, plugins) => Table`

`data` is a Svelte store containing an array of data to present on the table. If data needs to be updated (e.g. when editing the table or lazy-fetching data from the server), use a `Writable` store.

`plugins` is an object of plugin names to plugins. Refer to [the plugin system](../../plugins/overview.md) on how to use Svelte Headless Table plugins.

```ts
const table = createTable(data, {
  sort: addSortBy(),
  filter: addColumnFilters(),
});
```
