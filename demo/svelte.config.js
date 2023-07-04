import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  kit: {
    adapter: adapter(),
    prerender: {
      handleMissingId: 'warn',
    },
  },
  
  preprocess: vitePreprocess()
};

export default config;
