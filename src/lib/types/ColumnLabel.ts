import type { RenderPropsComponent } from './RenderProps';

export type ColumnLabelRenderProps<Item extends object> = {
	data: Item[];
};

export type ColumnLabel<Item extends object> =
	| string
	| RenderPropsComponent
	| ((props: ColumnLabelRenderProps<Item>) => string)
	| ((props: ColumnLabelRenderProps<Item>) => RenderPropsComponent);
