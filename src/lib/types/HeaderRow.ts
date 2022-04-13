import type { HeaderCell } from './HeaderCell';

export type HeaderRowData<Item extends object> = {
	cells: HeaderCell<Item>[];
};

export class HeaderRow<Item extends object> implements HeaderRowData<Item> {
	cells: HeaderCell<Item>[];
	constructor({ cells }: HeaderRowData<Item>) {
		this.cells = cells;
	}
}
