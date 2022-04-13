import type { RenderPropsComponent } from './RenderProps';

export type RowsLabelRenderProps<Item extends object> = {
	data: Item[];
};

export type RowsLabel<Item extends object> =
	| string
	| RenderPropsComponent
	| ((props: RowsLabelRenderProps<Item>) => string)
	| ((props: RowsLabelRenderProps<Item>) => RenderPropsComponent);
