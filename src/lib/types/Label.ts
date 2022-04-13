import type { RenderPropsComponent } from './RenderProps';

export type Label<Item extends object> =
	| string
	| RenderPropsComponent
	| ((rows: Item[]) => string)
	| ((rows: Item[]) => RenderPropsComponent);
