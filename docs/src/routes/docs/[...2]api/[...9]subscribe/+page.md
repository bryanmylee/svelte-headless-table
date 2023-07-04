---
title: Subscribe
description: Subscribe to non top-level Svelte stores within the template
sidebar_title: Subscribe
---

# {$frontmatter?.title}

`<Subscribe/>` lets you subscribe to non top-level stores in the Svelte template.

:::admonition type="note"
`<Subscribe/>` is based on [`svelte-subscribe`](https://github.com/bryanmylee/svelte-subscribe).
:::

## Granular stores

Svelte Headless Table is able to remain performant by using granular derived stores for each table component; this reduces the work required to update the view model when state changes. However, stores can only be subscribed to with the `$` auto-subscription syntax if they are defined in the top level of the `<script/>` tag.

`<Subscribe/>` cleverly gets around this limitation by using [slot props](https://svelte.dev/tutorial/slot-props).

## Usage

---

For every Svelte store prop that `<Subscribe/>` receives, it exposes a slot prop **of the same name** with the subscribed value.

```svelte
<Subscribe age={writable(21)} let:age>
  {age} <!-- 21 -->
</Subscribe>
```

`<Subscribe/>` is most commonly used with `.attrs()` and `.props()`.

```svelte
...
<tr>
  {#each headerRow.cells as cell (cell.id)}
    <Subscribe
      attrs={cell.attrs()} let:attrs
      props={cell.props()} let:props
    >
      <th {...attrs} on:click={props.sort.toggle}>
        <Render of={cell.render()} />
        {#if props.sort.order === 'asc'}
          ⬇️
        {:else if props.sort.order === 'desc'}
          ⬆️
        {/if}
      </th>
    </Subscribe>
  {/each}
</tr>
...
```
