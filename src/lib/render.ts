import type { SvelteComponent } from 'svelte';

export type SvelteComponentWithProps<
	C extends SvelteComponent = SvelteComponent,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Props = any
> = AConstructorTypeOf<C, [Svelte2TsxComponentConstructorParameters<Props>]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentRenderConfig<C extends SvelteComponent, Props = any> = {
	component: SvelteComponentWithProps<C, Props>;
	props?: Props;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RenderConfig<C extends SvelteComponent = SvelteComponent, Props = any> =
	| ComponentRenderConfig<C, Props>
	| string;

export function createRender<C extends SvelteComponent, Props extends Record<string, never>>(
	component: SvelteComponentWithProps<C, Props>
): ComponentRenderConfig<C, undefined>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRender<C extends SvelteComponent, Props = any>(
	component: SvelteComponentWithProps<C, Props>,
	props: Props
): ComponentRenderConfig<C, Props>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRender<C extends SvelteComponent, Props = any>(
	component: SvelteComponentWithProps<C, Props>,
	props?: Props
) {
	return {
		component,
		props,
	};
}
