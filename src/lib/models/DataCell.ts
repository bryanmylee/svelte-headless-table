import type { DataCellLabel } from '$lib/types/DataCellLabel';

export type DataCellData<Item extends object> = {
	key: keyof Item;
	value: Item[keyof Item];
	label?: DataCellLabel<Item>;
};

export class DataCell<Item extends object> implements DataCellData<Item> {
	key!: keyof Item;
	value!: Item[keyof Item];
	label?: DataCellLabel<Item>;
	constructor(props: DataCellData<Item>) {
		Object.assign(this, props);
	}
}
