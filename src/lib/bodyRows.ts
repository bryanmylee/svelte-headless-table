import { BodyCell } from './bodyCells';
import type { DataColumn } from './columns';
import type { Matrix } from './types/Matrix';

export interface BodyRowInit<Item> {
	id: string;
	cells: Array<BodyCell<Item>>;
}

export class BodyRow<Item> {
	id: string;
	cells: Array<BodyCell<Item>>;
	constructor({ id, cells }: BodyRowInit<Item>) {
		this.id = id;
		this.cells = cells;
	}
}

export const getBodyRows = <Item>(
	data: Array<Item>,
	flatColumns: Array<DataColumn<Item>>
): Array<BodyRow<Item>> => {
	const rowMatrix: Matrix<BodyCell<Item>> = data.map((item, rowIdx) => {
		return flatColumns.map((c) => {
			const value =
				c.accessorFn !== undefined
					? c.accessorFn(item)
					: c.accessorKey !== undefined
					? item[c.accessorKey]
					: undefined;
			return new BodyCell({ rowId: rowIdx.toString(), columnId: c.id, label: c.cell, value });
		});
	});
	return rowMatrix.map(
		(rowCells, rowIdx) => new BodyRow({ id: rowIdx.toString(), cells: rowCells })
	);
};
