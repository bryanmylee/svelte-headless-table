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

/**
 * HeaderDataCellInit should match non-inherited DataColumn class properties.
 */
export interface HeaderDataCellInit<Item> extends Omit<HeaderCellInit<Item>, 'colspan'> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	id: string;
}

export class HeaderDataCell<Item> extends HeaderCell<Item> {
	accessorKey?: keyof Item;
	accessorFn?: (item: Item) => unknown;
	id: string;
	constructor({ label, accessorKey, accessorFn, id }: HeaderDataCellInit<Item>) {
		super({ label, colspan: 1 });
		this.accessorKey = accessorKey;
		this.accessorFn = accessorFn;
		this.id = id;
	}
}

/**
 * HeaderGroupCellInit should match non-inherited GroupColumn class properties
 * except columns.
 */
export interface HeaderGroupCellInit<Item> extends HeaderCellInit<Item> {
	ids: Array<string>;
}

export class HeaderGroupCell<Item> extends HeaderCell<Item> {
	ids: Array<string>;
	constructor({ label, colspan, ids }: HeaderGroupCellInit<Item>) {
		super({ label, colspan });
		this.ids = ids;
	}
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface HeaderDisplayCellInit<Item> extends Partial<HeaderCellInit<Item>> {}

export class HeaderDisplayCell<Item> extends HeaderCell<Item> {
	constructor({ label = NBSP, colspan = 1 }: HeaderDisplayCellInit<Item> = {}) {
		super({ label, colspan });
	}
}
