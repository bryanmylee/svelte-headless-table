import type { TableInstance } from '$lib/models/TableInstance';
import type { RenderPropsComponent } from './RenderProps';

export type ColumnLabel<Item extends object> =
	| string
	| RenderPropsComponent
	| ((props: TableInstance<Item>) => string)
	| ((props: TableInstance<Item>) => RenderPropsComponent);
