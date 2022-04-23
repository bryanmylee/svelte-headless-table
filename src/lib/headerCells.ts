import { NBSP } from './constants';
import type { AggregateLabel } from './types/AggregateLabel';

export interface HeaderCellInit<Item> {
	label: AggregateLabel<Item>;
	colspan: number;
}

export class HeaderCell<Item> {
	label: AggregateLabel<Item>;
	colspan: number;
	constructor({ label, colspan }: HeaderCellInit<Item>) {
		this.label = label;
		this.colspan = colspan;
	}
}

export interface HeaderDataCellInit<Item> extends Omit<HeaderCellInit<Item>, 'colspan'> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
}

export class HeaderDataCell<Item> extends HeaderCell<Item> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	constructor({ label, accessorKey, accessorFn }: HeaderDataCellInit<Item>) {
		super({ label, colspan: 1 });
		this.accessorKey = accessorKey;
		this.accessorFn = accessorFn;
	}
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HeaderGroupCellInit<Item> extends HeaderCellInit<Item> {}

export class HeaderGroupCell<Item> extends HeaderCell<Item> {
	constructor({ label, colspan }: HeaderGroupCellInit<Item>) {
		super({ label, colspan });
	}
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HeaderDisplayCellInit<Item> extends Partial<HeaderCellInit<Item>> {}

export class HeaderDisplayCell<Item> extends HeaderCell<Item> {
	constructor({ label = NBSP, colspan = 1 }: HeaderDisplayCellInit<Item> = {}) {
		super({ label, colspan });
	}
}
