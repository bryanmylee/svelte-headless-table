import { derived } from 'svelte/store';
import { BodyCell } from './bodyCells';
import type { DataColumn } from './columns';
import { TableComponent } from './tableComponent';
import type { AnyTablePropSet, TablePropSet } from './types/UseTablePlugin';

export interface BodyRowInit<Item> {
	id: string;
	item: Item;
	cells: Array<BodyCell<Item>>;
	cellForId: Record<string, BodyCell<Item>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-interface
export interface BodyRowAttributes<Item> {}

export class BodyRow<Item, E extends TablePropSet = AnyTablePropSet> extends TableComponent<
	Item,
	'tbody.tr',
	E
> {
	item: Item;
	cells: Array<BodyCell<Item>>;
	cellForId: Record<string, unknown>;
	constructor({ id, item, cells, cellForId }: BodyRowInit<Item>) {
		super({ id });
		this.item = item;
		this.cells = cells;
		this.cellForId = cellForId;
	}

	attrs() {
		return derived([], () => {
			return {};
		});
	}
}

export const getBodyRows = <Item>(
	data: Array<Item>,
	flatColumns: Array<DataColumn<Item>>
): Array<BodyRow<Item>> => {
	const rows: Array<BodyRow<Item>> = [];
	for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
		const item = data[rowIdx];
		rows.push(
			new BodyRow({
				id: rowIdx.toString(),
				item,
				cells: [],
				cellForId: {},
			})
		);
	}
	data.forEach((item, rowIdx) => {
		const cells = flatColumns.map((c) => {
			const value =
				c.accessorFn !== undefined
					? c.accessorFn(item)
					: c.accessorKey !== undefined
					? item[c.accessorKey]
					: undefined;
			return new BodyCell({ row: rows[rowIdx], column: c, label: c.cell, value });
		});
		rows[rowIdx].cells = cells;
		flatColumns.forEach((c, colIdx) => {
			rows[rowIdx].cellForId[c.id] = cells[colIdx];
		});
	});
	return rows;
};
