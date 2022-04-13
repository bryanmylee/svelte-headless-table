import type { FooterCell } from './FooterCell';

export type FooterRowInit<Item extends object> = {
	cells: FooterCell<Item>[];
};

export class FooterRow<Item extends object> implements FooterRowInit<Item> {
	cells!: FooterCell<Item>[];
	constructor({ cells }: FooterRowInit<Item>) {
		Object.assign(this, { cells });
	}
}
