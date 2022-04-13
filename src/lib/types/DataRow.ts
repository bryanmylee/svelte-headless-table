import type { DataCell } from './DataCell';

export type DataRowData<Item extends object> = {
	cells: DataCell<Item>[];
};

export class DataRow<Item extends object> implements DataRowData<Item> {
	cells!: DataCell<Item>[];
	constructor(props: DataRowData<Item>) {
		Object.assign(this, props);
	}
}
