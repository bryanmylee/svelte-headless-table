import type { SvelteComponent } from 'svelte';

export type RenderProps = {
	text?: string;
	component?: SvelteComponent;
	props?: Record<string, unknown>;
};
