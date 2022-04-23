import type { SvelteComponent } from 'svelte';

export type RenderPropsComponent = {
	component: typeof SvelteComponent;
	props?: Record<string, unknown>;
};

export type RenderPropsText = {
	text: string;
};

export type RenderProps = Partial<RenderPropsComponent & RenderPropsText>;
