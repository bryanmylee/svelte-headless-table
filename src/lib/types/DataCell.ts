import type { DataCellLabel } from './DataCellLabel';

export type DataCell<Item extends object> = {
	key: keyof Item;
	value: Item[keyof Item];
	label?: DataCellLabel<Item>;
};
