---
title: createViewModel
description: Generate the view model for the table
sidebar_title: createViewModel
---

<script>
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`Table#createViewModel` derives the view model that is applied onto markup. It is called on the table instance with `Column` instances, and returns a [`TableViewModel`](../table-view-model.md).

## Usage

---

### `Table#createViewModel: (columns, options) => TableViewModel`

`columns` is an array of `Column` instances returned from [`Table#createColumns`](../create-columns.md#table-createcolumns-columns-column).

`options` is an optional configuration object to configure the view model.

```ts {4}
const table = createTable(data);
const columns = table.createColumns(...);
const viewModel = table.createViewModel(columns);
const {
  headerRows,
  rows,
  tableAttrs,
  tableBodyAttrs,
} = viewModel;
```

#### `options.rowDataId?: (item, index) => string`

Defines a custom [`dataId`](../body-row.md#dataid-string) for each row.

:::admonition type="warning"
In the context of sub-rows, the `index` of the first sub-row is `0`.
:::

_Defaults to the item index_.