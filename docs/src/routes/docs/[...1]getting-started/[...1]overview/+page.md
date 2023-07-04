---
title: Overview
description: What is Svelte Headless Table?
---

# {$frontmatter?.title}

Svelte Headless Table provides a collection of Svelte stores that describe and enable powerful tables and datagrids. It is heavily inspired by [React Table](https://react-table.tanstack.com/) but designed from the ground up to be more _Svelte_.

## What is a "headless" UI library?

As described by its name, Svelte Headless Table is a headless utility, which means it does not supply any components out of the box. As a developer, you have full control over how your table is rendered. [Read this article to understand why Svelte Headless Table is built this way](https://www.merrickchristensen.com/articles/headless-user-interface-components/). In summary, headless components are important for:

- **Separation of Concerns** - Svelte Headless Table is the [view model](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) that connects your data to your rendered UI; it has no reason to be in charge of your UI. The look, feel, and overall experience of your table is what makes your app or product great. The less Svelte Headless Table gets in the way of that, the better!
- **Maintenance** - By solely focusing on the view model, Svelte Headless Table does not have to support the seemingly endless API surface for every UI use-case. It can remain small, easy-to-use, and simple to update/maintain.
- **Extensibility** - UI is a creative medium where every developer does things differently. By not dictating UI concerns, Svelte Headless Table empowers the developer to design and extend the UI based on their unique use-case.

## A Table Utility, not a Table Component

By acting as an ultra-smart table utility, Svelte Headless Table opens up the possibility for your tables to integrate into any existing theme, UI library or existing table markup. This also means that if you don't have an existing table component or table styles, Svelte Headless Table will help you learn to build the table markup and styles required to display great tables.
