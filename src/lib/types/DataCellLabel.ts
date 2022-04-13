import type { RenderPropsComponent } from './RenderProps';

export type DataCellLabelRenderProps<Item extends object> = {
	value: Item[keyof Item];
};

export type DataCellLabel<Item extends object> =
	| ((props: DataCellLabelRenderProps<Item>) => string)
	| ((props: DataCellLabelRenderProps<Item>) => RenderPropsComponent);
