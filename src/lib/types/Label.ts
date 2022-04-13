import type { DataCell } from './DataCell';
import type { RenderPropsComponent } from './RenderProps';

export type Label<Item extends object> =
	| string
	| RenderPropsComponent
	| ((rows: DataCell<Item>[][]) => string)
	| ((rows: DataCell<Item>[][]) => RenderPropsComponent);
