---
title: createRender
description: Configure a Svelte component with props to create a render config
sidebar_title: createRender
---

<script>
  import { Render, createRender } from 'svelte-headless-table';
  import { useHljs } from '$lib/utils/useHljs';
  useHljs('ts');
</script>

# {$frontmatter?.title}

`createRender` lets you define complex Svelte component behaviors within the script.

It combines a component with props and events to create a `ComponentRenderConfig` that is passed into [`Render#of`](../--render.md) to dynamically render Svelte components.

:::admonition type="note"
`createRender` is based on [`svelte-render`](https://github.com/bryanmylee/svelte-render).
:::

`createRender` accepts a Svelte component and either:

1. an object of static props; or
2. a `Readable` object for dynamic props.

To define event handlers, chain `.on(type, handler)` method calls.

## Usage

---

### `createRender: (component: Component, props?: Props) => ComponentRenderConfig`

Creates a render configuration with a Svelte component and static props.

```svelte
<script>
  import Profile from './Profile.svelte';
  const profile = createRender(Profile, {
    name: 'Alan Turing'
  });
</script>

<Render of={profile} />
```

<script>
  import Profile from './Profile.svelte';
  const profile = createRender(Profile, { name: 'Alan Turing' });
</script>

<Render of={profile} />

---

### `createRender: (component: Component, props?: Readable<Props>) => ComponentRenderConfig`

Creates a render configuration with a Svelte component and dynamic props.

```svelte
<script>
  import Profile from './Profile.svelte';
  const name = writable('Grace Hopper');
  const profile = createRender(
    Profile,
    derived(name, n => ({ name: n }))
  );
</script>

<Render of={profile} />
```

<script>
  import { Menu, MenuItem } from '@svelteness/kit-docs';
  import { writable, derived } from 'svelte/store';

  const name = writable('Grace Hopper');
  const dynamicProfile = createRender(
    Profile,
    derived(name, n => ({ name: n }))
  );
</script>

<div class="flex justify-end items-baseline mb-4">
  <code>$name =
  <Menu class="ml-auto">
    <span slot="button" class="text-base">{$name}</span>
    {#each ['Grace Hopper', 'Ken Thompson', 'Donald Knuth'] as n}
      <MenuItem selected={$name === n} on:select={() => $name = n}>
        {n}
      </MenuItem>
    {/each}
  </Menu></code>
</div>
<Render of={dynamicProfile} />

### `.on(type: EventType, handler: (ev) => void)`

`ComponentRenderConfig` exposes an `.on()` method that allows events to be defined and attached to the component when it is mounted.

```svelte
<script>
  import Notice from './Notice.svelte';
  const noticeProps = writable({ count: 0 });
  const notice = createRender(Notice, noticeProps)
    .on('click', (() => $noticeProps.count++))
    .on('click', ev => console.log(ev));
</script>

<Render of={notice} />
```

<script lang="ts">
  import Notice from './Notice.svelte';
  const noticeProps = writable({ count: 0 });
  const notice = createRender(Notice, noticeProps)
    .on('click', (() => $noticeProps.count++))
    .on('click', ev => console.log(ev));
</script>

<Render of={notice} />
