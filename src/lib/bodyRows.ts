import { BodyCell } from './bodyCells';
import type { DataColumn } from './columns';
import type { Matrix } from './types/Matrix';

export interface BodyRowInit<Item> {
	cells: Array<BodyCell<Item>>;
}

export class BodyRow<Item> {
	cells: Array<BodyCell<Item>>;
	constructor({ cells }: BodyRowInit<Item>) {
		this.cells = cells;
	}
}

export const getBodyRows = <Item>(
	data: Array<Item>,
	flatColumns: Array<DataColumn<Item>>
): Array<BodyRow<Item>> => {
	const rowMatrix: Matrix<BodyCell<Item>> = data.map((item) => {
		return flatColumns.map((c) => {
			const value =
				c.accessorFn !== undefined
					? c.accessorFn(item)
					: c.accessorKey !== undefined
					? item[c.accessorKey]
					: undefined;
			return new BodyCell({ columnId: c.id, label: c.cell, value });
		});
	});
	return rowMatrix.map((rowCells) => new BodyRow({ cells: rowCells }));
};
