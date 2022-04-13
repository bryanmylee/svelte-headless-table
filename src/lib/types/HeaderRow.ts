import type { HeaderCell } from './HeaderCell';

export type HeaderRowData<Item extends object> = {
	cells: HeaderCell<Item>[];
};

export class HeaderRow<Item extends object> implements HeaderRowData<Item> {
	cells!: HeaderCell<Item>[];
	constructor(props: HeaderRowData<Item>) {
		Object.assign(this, props);
	}
}
