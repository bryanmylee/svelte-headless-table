import type { Load } from '@sveltejs/kit';

export const prerender = true;

export const load: Load = () => {
  return {
    status: 307,
    redirect: '/docs/api/create-table',
  };
};