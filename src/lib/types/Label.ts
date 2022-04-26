import type { RenderPropsComponent } from './RenderProps';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Label<Item, Value> =
	| ((value: Value) => string)
	| ((value: Value) => RenderPropsComponent);
