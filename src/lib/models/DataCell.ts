import type { DataCellLabel } from '$lib/types/DataCellLabel';
import { isFunction } from '$lib/utils/isFunction';
import type { TableInstance } from './TableInstance';

export type DataCellInit<Item extends object> = {
	table: TableInstance<Item>;
	key: keyof Item;
	value: Item[keyof Item];
	label?: DataCellLabel<Item>;
};

export class DataCell<Item extends object> implements DataCellInit<Item> {
	table!: TableInstance<Item>;
	key!: keyof Item;
	value!: Item[keyof Item];
	label?: DataCellLabel<Item>;
	constructor({ table, key, value, label }: DataCellInit<Item>) {
		console.log('init DataCell');
		Object.assign(this, { table, key, value, label });
	}
	render() {
		if (this.label === undefined) {
			return { text: `${this.value}` };
		}
		if (isFunction(this.label)) {
			const label = this.label({ value: this.value });
			if (typeof label === 'string') {
				return { text: label };
			}
			return label;
		}
		return {};
	}
}
