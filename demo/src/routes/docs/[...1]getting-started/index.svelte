<script lang="ts" context="module">
  import type { Load } from '@sveltejs/kit';

  export const prerender = true;

  export const load: Load = () => {
    return {
      status: 307,
      redirect: '/docs/getting-started/overview',
    };
  };
</script>
