import type { DataCell } from './DataCell';

export type DataRow<Item extends object> = {
	cells: DataCell<Item>[];
};
