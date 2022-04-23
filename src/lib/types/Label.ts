import type { RenderPropsComponent } from './RenderProps';

export type Label<Item> =
	| ((value: Item[keyof Item]) => string)
	| ((value: Item[keyof Item]) => RenderPropsComponent);
