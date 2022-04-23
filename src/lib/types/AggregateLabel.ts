import type { RenderPropsComponent } from './RenderProps';

// If the function types are removed from the union, generics will not be
// inferred for subtypes.
export type AggregateLabel<Item> =
	| string
	| RenderPropsComponent
	| ((data: Item[]) => string)
	| ((data: Item[]) => RenderPropsComponent);
