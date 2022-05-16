# Svelte Headless Table

[![npm version](http://img.shields.io/npm/v/svelte-headless-table.svg)](https://www.npmjs.com/package/svelte-headless-table)
[![npm downloads](https://img.shields.io/npm/dm/svelte-headless-table.svg)](https://www.npmjs.com/package/svelte-headless-table)
![license](https://img.shields.io/npm/l/svelte-headless-table)
![build](https://img.shields.io/github/workflow/status/bryanmylee/svelte-headless-table/publish)
[![coverage](https://coveralls.io/repos/github/bryanmylee/svelte-headless-table/badge.svg?branch=main)](https://coveralls.io/github/bryanmylee/svelte-headless-table?branch=main)

**Unopinionated and extensible data tables for Svelte**

> Build and design powerful datagrid experiences while retaining 100% control over styles and markup.

Get started with the [quick start guide](https://svelte-headless-table.bryanmylee.com/docs/getting-started/quick-start)!

### Headless

Beauty is subjective – everybody wants components to match their own theme! That's why Svelte Headless Table is **headless** by design. You are in full control of how your table looks, down to the very last component, class, and style.

### Declarative

Just describe how you want your tables to behave and let Svelte Headless Table handle the rest! It is designed with full TypeScript support and an intuitive API that lets you get started immediately.

### Extensible

Svelte Headless Table comes with a stable plugin system that allows you to transform and modify every step under the hood. If you want extra functionality, you can build it!

## The Plugin System

Svelte Headless Table is designed with extensibility in mind. Its complex features are provided by an extensive suite of plugins.

> The Plugin API is still in development and may change while Svelte Headless Table works towards v1.0.

### Plugin roadmap

- [x] [addSortBy](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-sort-by)
- [x] [addColumnFilters](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-column-filters)
- [x] [addTableFilter](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-table-filter)
- [x] [addColumnOrder](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-column-order)
- [x] [addHiddenColumns](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-hidden-columns)
- [x] [addPagination](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-pagination)
- [x] [addSubRows](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-sub-rows)
- [x] [addExpandedRows](https://svelte-headless-table.bryanmylee.com/docs/plugins/add-expanded-rows)
- [ ] addGroupBy
- [ ] addRowSelect
- [ ] addResizeColumns
- [ ] addEditable
- [ ] addRowLabel
