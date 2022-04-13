import type { DataCellLabel } from '$lib/types/DataCellLabel';

export type DataCellInit<Item extends object> = {
	key: keyof Item;
	value: Item[keyof Item];
	label?: DataCellLabel<Item>;
};

export class DataCell<Item extends object> implements DataCellInit<Item> {
	key!: keyof Item;
	value!: Item[keyof Item];
	label?: DataCellLabel<Item>;
	constructor({ key, value, label }: DataCellInit<Item>) {
		console.log('init DataCell');
		Object.assign(this, { key, value, label });
	}
}
