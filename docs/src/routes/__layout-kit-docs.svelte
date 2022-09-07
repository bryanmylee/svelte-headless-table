<script lang="ts" context="module">
  export const prerender = true;

  export const load = createKitDocsLoader({
    sidebar: {
      '/': null as unknown as string,
      '/docs': '/docs',
    },
  });
</script>

<script lang="ts">
  import '../app.css';
  import '@svelteness/kit-docs/client/polyfills/index.js';
  import '@svelteness/kit-docs/client/styles/fonts.css';
  import '$lib/styles/vars.css';

  import { page } from '$app/stores';
  import SvelteHeadlessTableIcon from '$img/svelte-headless-table.svg?raw';
  import type { MarkdownMeta, ResolvedSidebarConfig, NavbarConfig } from '@svelteness/kit-docs';

  import {
    KitDocs,
    KitDocsLayout,
    createKitDocsLoader,
    createSidebarContext,
  } from '@svelteness/kit-docs';

  export let meta: MarkdownMeta | null = null;

  export let sidebar: ResolvedSidebarConfig | null = null;

  const navbar: NavbarConfig = {
    links: [
      { title: 'Documentation', slug: '/docs', match: /\/docs/ },
      { title: 'Credits', slug: '/credits', match: /\/credits/ },
      { title: 'GitHub', slug: 'https://github.com/bryanmylee/svelte-headless-table' },
    ],
  };

  const { activeCategory } = createSidebarContext(sidebar);

  $: category = $activeCategory ? `${$activeCategory}: ` : '';
  $: title = meta ? `${category}${meta.title} | Svelte Headless Table | Bryan Lee` : null;
  $: description = meta?.description;
</script>

<svelte:head>
  {#key $page.url.pathname}
    {#if title}
      <title>{title}</title>
    {/if}
    {#if description}
      <meta name="description" content={description} />
    {/if}
  {/key}
</svelte:head>

<KitDocs {meta}>
  <KitDocsLayout {navbar} {sidebar}>
    <div class="logo" slot="navbar-left">
      <a href="/" class="hover:opacity-50 transition-opacity">
        <div class="flex items-center gap-4">
          <span>
            {@html SvelteHeadlessTableIcon}
          </span>
          <h1 class="text-secondary dark:text-white font-semibold text-2xl tracking-tight">
            Svelte Headless Table
          </h1>
        </div>
      </a>
    </div>

    <slot />
  </KitDocsLayout>
</KitDocs>

<style>
  :global(:root) {
    --kd-color-primary-rgb: 46, 196, 182;
    --kd-color-primary-light-rgb: 73, 212, 198;
    --kd-color-primary-dark-rgb: 43, 182, 168;
    --kd-color-secondary-rgb: 31, 26, 56;
    --kd-color-red-rgb: 255, 71, 96;
    --kd-color-red-light-rgb: 255, 112, 131;
    --kd-color-red-dark-rgb: 255, 51, 78;
    --kd-color-purple-rgb: 92, 77, 168;
    --kd-color-purple-light-rgb: 115, 101, 184;
    --kd-color-purple-dark-rgb: 77, 64, 140;
  }

  :global(:root.dark) {
    --kd-color-primary-rgb: 46, 196, 182;
    --kd-color-primary-light-rgb: 73, 212, 198;
    --kd-color-primary-dark-rgb: 43, 182, 168;
    --kd-color-red-rgb: 255, 92, 114;
    --kd-color-red-light-rgb: 255, 133, 149;
    --kd-color-red-dark-rgb: 255, 71, 96;
    --kd-color-purple-rgb: 141, 129, 197;
    --kd-color-purple-light-rgb: 167, 157, 210;
    --kd-color-purple-dark-rgb: 117, 101, 184;
  }

  .logo :global(a) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo :global(svg) {
    height: 36px;
    overflow: hidden;
  }
</style>
