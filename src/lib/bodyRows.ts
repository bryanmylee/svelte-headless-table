import { derived } from 'svelte/store';
import { BodyCell } from './bodyCells';
import type { DataColumn } from './columns';
import { TableComponent } from './tableComponent';
import type { AnyTablePropSet, TablePropSet } from './types/plugin';

export interface BodyRowInit<Item> {
	id: string;
	cells: Array<BodyCell<Item>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-interface
export interface BodyRowAttributes<Item> {}

export class BodyRow<Item, E extends TablePropSet = AnyTablePropSet> extends TableComponent<
	Item,
	'tbody.tr',
	E
> {
	cells: Array<BodyCell<Item>>;
	constructor({ id, cells }: BodyRowInit<Item>) {
		super({ id });
		this.cells = cells;
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
	for (let i = 0; i < data.length; i++) {
		rows.push(new BodyRow({ id: i.toString(), cells: [] }));
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
	});
	return rows;
};
