import { derived } from 'svelte/store';
import { BodyCell } from './bodyCells';
import type { DataColumn } from './columns';
import { TableComponent } from './tableComponent';
import type { AnyPlugins } from './types/UseTablePlugin';

export interface BodyRowInit<Item, Plugins extends AnyPlugins = AnyPlugins> {
	id: string;
	item: Item;
	cells: BodyCell<Item, Plugins>[];
	cellForId: Record<string, BodyCell<Item, Plugins>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-interface
export interface BodyRowAttributes<Item, Plugins extends AnyPlugins = AnyPlugins> {}

export class BodyRow<Item, Plugins extends AnyPlugins = AnyPlugins> extends TableComponent<
	Item,
	Plugins,
	'tbody.tr'
> {
	item: Item;
	cells: BodyCell<Item, Plugins>[];
	cellForId: Record<string, BodyCell<Item, Plugins>>;
	constructor({ id, item, cells, cellForId }: BodyRowInit<Item, Plugins>) {
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

export const getBodyRows = <Item, Plugins extends AnyPlugins = AnyPlugins>(
	data: Item[],
	flatColumns: DataColumn<Item, Plugins>[]
): BodyRow<Item, Plugins>[] => {
	const rows: BodyRow<Item, Plugins>[] = [];
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
