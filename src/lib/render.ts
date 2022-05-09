import type { SvelteComponent } from 'svelte';
import type { Readable } from 'svelte/store';

export type SvelteComponentWithProps<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Props = any,
	C extends SvelteComponent = SvelteComponent
> = AConstructorTypeOf<C, [Svelte2TsxComponentConstructorParameters<Props>]>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentRenderConfig<Props = any, C extends SvelteComponent = SvelteComponent> = {
	component: SvelteComponentWithProps<Props, C>;
	props?: Props | Readable<Props>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RenderConfig<Props = any, C extends SvelteComponent = SvelteComponent> =
	| ComponentRenderConfig<Props, C>
	| string
	| number
	| Readable<string | number>;

export function createRender<Props extends Record<string, never>, C extends SvelteComponent>(
	component: SvelteComponentWithProps<Props, C>
): ComponentRenderConfig<undefined, C>;
export function createRender<Props, C extends SvelteComponent>(
	component: SvelteComponentWithProps<Props, C>,
	props: Props | Readable<Props>
): ComponentRenderConfig<Props, C>;
export function createRender<Props, C extends SvelteComponent>(
	component: SvelteComponentWithProps<Props, C>,
	props?: Props | Readable<Props>
) {
	return {
		component,
		props,
	};
}
