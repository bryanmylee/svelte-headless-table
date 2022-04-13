import type { FooterCell } from './FooterCell';

export type FooterRowData<Item extends object> = {
	cells: FooterCell<Item>[];
};

export class FooterRow<Item extends object> implements FooterRowData<Item> {
	cells!: FooterCell<Item>[];
	constructor(props: FooterRowData<Item>) {
		Object.assign(this, props);
	}
}
