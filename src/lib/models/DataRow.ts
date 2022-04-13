import type { DataCell } from './DataCell';

export type DataRowInit<Item extends object> = {
	cells: DataCell<Item>[];
};

export class DataRow<Item extends object> implements DataRowInit<Item> {
	cells!: DataCell<Item>[];
	constructor({ cells }: DataRowInit<Item>) {
		Object.assign(this, { cells });
	}
}
