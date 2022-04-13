import type { SvelteComponent } from 'svelte';

export type RenderPropsComponent = {
	component: SvelteComponent;
	props?: Record<string, unknown>;
};

export type RenderPropsText = {
	text: string;
};

export type RenderProps = Partial<RenderPropsComponent> & Partial<RenderPropsText>;
